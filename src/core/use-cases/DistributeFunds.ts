/**
 * DistributeFunds — Use Case
 *
 * @what     Registra un ingreso y lo reparte entre jarras (M02, Registro de Ingreso).
 * @receives DistributeFundsInput — monto total, concepto, reparto por jarra (en $), workspace, usuario.
 * @processes El dinero **entra una sola vez** (un `ingreso` en Libre por el total) y luego se mueve
 *           con **transferencias** Libre → jarra. Antes creaba N `ingreso`, uno por jarra: en
 *           Movimientos parecía que habías cobrado cinco veces, y el barChart contaba cinco ingresos.
 *           Cobras una vez; repartir es otra cosa.
 *           Lo no repartido se queda en Libre — sin escribir nada, porque ya está ahí.
 *           Los balances no se tocan: se derivan del libro (C4).
 * @returns  { income, transfers }
 */
import { JarType } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface DistributionEntry {
  jarId: string;
  amount: number;
}

export interface DistributeFundsInput {
  id: string;
  totalAmount: number;
  description: string;
  distribution: DistributionEntry[];
  workspaceId: string;
  userId: string;
}

export interface DistributeFundsResult {
  income: Transaction;
  transfers: Transaction[];
}

export class DistributeFunds {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: DistributeFundsInput): Promise<DistributeFundsResult> {
    if (input.totalAmount <= 0) throw new Error('El monto debe ser mayor a cero');

    const jars = await this.jarRepo.findByWorkspace(input.workspaceId);
    const libreJar = jars.find((j) => j.type === ('libre' as JarType));
    if (!libreJar) throw new Error('Libre jar not found for workspace');

    // Lo que va a otras jarras. Repartir a Libre es un no-op: el dinero ya cae ahí.
    const moves = input.distribution.filter((e) => e.amount > 0 && e.jarId !== libreJar.id);
    const distributed = moves.reduce((sum, e) => sum + e.amount, 0);
    if (distributed > input.totalAmount) throw new Error('Distribution exceeds total amount');

    const now = new Date();

    const income = new Transaction({
      id: input.id,
      amount: input.totalAmount,
      jarId: libreJar.id,
      type: 'ingreso',
      description: input.description,
      date: now,
      workspaceId: input.workspaceId,
      userId: input.userId,
      // Un ingreso nunca es hormiga (hormiga es un GASTO de dinero sin asignar) y no es transferencia.
      // Los dos salen del `type`, no de comparar ids de jarra.
      isHormiga: false,
      isTransfer: false,
    });
    await this.transactionRepo.save(income);

    const transfers: Transaction[] = [];
    for (const move of moves) {
      const jar = jars.find((j) => j.id === move.jarId);
      if (!jar) throw new Error(`Jar ${move.jarId} not found`);

      const transfer = new Transaction({
        id: `${input.id}-${move.jarId}`,
        amount: move.amount,
        jarId: libreJar.id,
        toJarId: jar.id,
        type: 'transferencia',
        description: `Reparto: ${jar.name}`,
        date: now,
        workspaceId: input.workspaceId,
        userId: input.userId,
        isHormiga: false,
        isTransfer: true,
      });
      await this.transactionRepo.save(transfer);
      transfers.push(transfer);
    }

    return { income, transfers };
  }
}
