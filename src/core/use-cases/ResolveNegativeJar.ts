/**
 * ResolveNegativeJar — Use Case
 *
 * @what     Una jarra quedó en negativo (M03). Tres salidas: reequilibrar desde otra jarra,
 *           convertirlo en deuda, o reclasificar el gasto a la jarra que le tocaba.
 * @receives ResolveNegativeJarInput — jarra negativa, elección, y los datos que pide cada camino.
 * @processes Ya NO teclea balances (C4: el balance se deriva del libro). Cada camino escribe el
 *           movimiento que explica de dónde sale el dinero:
 *           · rebalance  → transferencia `sourceJar` → jarra negativa por el déficit.
 *           · debt       → `Debt` nueva + ingreso del déficit en la jarra (el dinero lo pone el
 *                          préstamo; la deuda queda registrada aparte, en su colección).
 *           · reclassify → la transacción cambia de jarra. Sin aritmética: al mover la fila, las dos
 *                          jarras se recalculan solas. Antes había que ajustar los dos balances a mano.
 * @returns  ResolveNegativeJarResult (unión discriminada por `choice`)
 */
import { Debt, DebtOrigin } from '../entities/Debt';
import { Jar } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { IDebtRepository } from '../ports/IDebtRepository';

export type ResolveChoice = 'rebalance' | 'debt' | 'reclassify';

export interface ResolveNegativeJarInput {
  debtId: string;
  transactionId: string;
  negativeJarId: string;
  choice: ResolveChoice;
  workspaceId: string;
  userId: string;
  // rebalance: jarra de la que se saca el dinero
  sourceJarId?: string;
  // reclassify: jarra a la que se muda el gasto
  reclassifyToJarId?: string;
  reclassifyTransactionId?: string;
}

export type ResolveNegativeJarResult =
  | { choice: 'rebalance'; jar: Jar; sourceJar: Jar; transaction: Transaction }
  | { choice: 'debt'; jar: Jar; debt: Debt; transaction: Transaction }
  | { choice: 'reclassify'; jar: Jar; targetJar: Jar; transaction: Transaction };

export class ResolveNegativeJar {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly debtRepo: IDebtRepository,
  ) {}

  async execute(input: ResolveNegativeJarInput): Promise<ResolveNegativeJarResult> {
    const jar = await this.jarRepo.findById(input.negativeJarId);
    if (!jar) throw new Error(`Jar ${input.negativeJarId} not found`);
    if (!jar.isNegative()) throw new Error('Jar is not negative');

    const deficit = Math.abs(jar.balance);
    const now = new Date();

    if (input.choice === 'rebalance') {
      if (!input.sourceJarId) throw new Error('sourceJarId required for rebalance');
      const sourceJar = await this.jarRepo.findById(input.sourceJarId);
      if (!sourceJar) throw new Error(`Source jar ${input.sourceJarId} not found`);

      const transaction = new Transaction({
        id: input.transactionId,
        amount: deficit,
        jarId: sourceJar.id,
        toJarId: jar.id,
        type: 'transferencia',
        description: `Reequilibrio de ${jar.name}`,
        date: now,
        workspaceId: input.workspaceId,
        userId: input.userId,
      });

      await this.transactionRepo.save(transaction);
      return { choice: 'rebalance', jar, sourceJar, transaction };
    }

    if (input.choice === 'debt') {
      const debt = new Debt({
        id: input.debtId,
        description: `Deuda de jarra ${jar.name}`,
        amount: deficit,
        dueDay: Math.min(now.getDate(), 28), // 29–31 no existen en todos los meses
        cuotas: 1,
        workspaceId: input.workspaceId,
        createdAt: now,
        origin: 'jarra_negativa' as DebtOrigin,
        sourceJarId: jar.id, // la paga la jarra que se hundió: ella generó el agujero
      });

      // El dinero que tapa el hueco lo pone el préstamo → entra en la jarra como ingreso.
      // La obligación de devolverlo vive en `debts`, su propia colección.
      const transaction = new Transaction({
        id: input.transactionId,
        amount: deficit,
        jarId: jar.id,
        type: 'ingreso',
        description: `Deuda asumida: ${jar.name}`,
        date: now,
        workspaceId: input.workspaceId,
        userId: input.userId,
      });

      await this.debtRepo.save(debt);
      await this.transactionRepo.save(transaction);
      return { choice: 'debt', jar, debt, transaction };
    }

    // reclassify
    if (!input.reclassifyToJarId || !input.reclassifyTransactionId) {
      throw new Error('reclassifyToJarId and reclassifyTransactionId required for reclassify');
    }
    const targetJar = await this.jarRepo.findById(input.reclassifyToJarId);
    if (!targetJar) throw new Error(`Target jar ${input.reclassifyToJarId} not found`);

    const original = await this.transactionRepo.findById(input.reclassifyTransactionId);
    if (!original) throw new Error(`Transaction ${input.reclassifyTransactionId} not found`);

    // Misma transacción, otra jarra. Los dos balances se recalculan solos.
    const reclassified = new Transaction({
      id: input.transactionId,
      amount: original.amount,
      jarId: targetJar.id,
      type: original.type,
      description: original.description,
      date: original.date,
      workspaceId: input.workspaceId,
      userId: input.userId,
      items: original.items,
      receiptUri: original.receiptUri,
    });

    await this.transactionRepo.delete(original.id);
    await this.transactionRepo.save(reclassified);
    return { choice: 'reclassify', jar, targetJar, transaction: reclassified };
  }
}
