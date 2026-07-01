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
  // rebalance: source jar to pull funds from
  sourceJarId?: string;
  // reclassify: move transaction to another jar
  reclassifyToJarId?: string;
  reclassifyTransactionId?: string;
}

export type ResolveNegativeJarResult =
  | { choice: 'rebalance'; jar: Jar; sourceJar: Jar }
  | { choice: 'debt'; jar: Jar; debt: Debt }
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

    if (input.choice === 'rebalance') {
      if (!input.sourceJarId) throw new Error('sourceJarId required for rebalance');
      const sourceJar = await this.jarRepo.findById(input.sourceJarId);
      if (!sourceJar) throw new Error(`Source jar ${input.sourceJarId} not found`);

      const deficit = Math.abs(jar.balance);
      sourceJar.balance -= deficit;
      jar.balance = 0;

      await this.jarRepo.update(jar);
      await this.jarRepo.update(sourceJar);
      return { choice: 'rebalance', jar, sourceJar };
    }

    if (input.choice === 'debt') {
      const deficit = Math.abs(jar.balance);
      const debt = new Debt({
        id: input.debtId,
        description: `Deuda de jarra ${jar.name}`,
        amount: deficit,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cuotas: 1,
        paidCuotas: 0,
        workspaceId: input.workspaceId,
        createdAt: new Date(),
        origin: 'jarra_negativa' as DebtOrigin,
        sourceJarId: jar.id,
      });
      jar.resetToZero();

      await this.jarRepo.update(jar);
      await this.debtRepo.save(debt);
      return { choice: 'debt', jar, debt };
    }

    // reclassify
    if (!input.reclassifyToJarId || !input.reclassifyTransactionId) {
      throw new Error('reclassifyToJarId and reclassifyTransactionId required for reclassify');
    }
    const targetJar = await this.jarRepo.findById(input.reclassifyToJarId);
    if (!targetJar) throw new Error(`Target jar ${input.reclassifyToJarId} not found`);

    const original = await this.transactionRepo.findById(input.reclassifyTransactionId);
    if (!original) throw new Error(`Transaction ${input.reclassifyTransactionId} not found`);

    // restore original jar
    jar.balance += original.amount;
    targetJar.balance -= original.amount;

    const reclassified = new Transaction({
      id: input.transactionId,
      amount: original.amount,
      jarId: targetJar.id,
      type: original.type,
      description: original.description,
      date: original.date,
      workspaceId: input.workspaceId,
      userId: input.userId,
      isHormiga: false,
    });

    await this.jarRepo.update(jar);
    await this.jarRepo.update(targetJar);
    await this.transactionRepo.delete(original.id);
    await this.transactionRepo.save(reclassified);
    return { choice: 'reclassify', jar, targetJar, transaction: reclassified };
  }
}
