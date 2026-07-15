/**
 * TransferFunds — Use Case
 *
 * @what     Mueve dinero entre dos jarras. NO cambia el patrimonio: el dinero ya era tuyo, cambia
 *           de sitio.
 * @receives TransferFundsInput — id, jarra origen/destino, monto, workspace, usuario.
 * @processes Escribe **UNA** transacción `transferencia` con `jarId` = origen y `toJarId` = destino.
 *           Antes escribía dos (una por jarra) y además tecleaba los dos balances: con el balance
 *           derivado (C4) eso restaría de ambas jarras y el dinero se evaporaría. Una transacción,
 *           dos caras — así lo suma `ComputeJarBalances`.
 * @returns  { sourceJar, destinationJar, transaction }
 */
import { Jar } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface TransferFundsInput {
  id: string;
  sourceJarId: string;
  destinationJarId: string;
  amount: number;
  workspaceId: string;
  userId: string;
}

export interface TransferFundsResult {
  sourceJar: Jar;
  destinationJar: Jar;
  transaction: Transaction;
}

export class TransferFunds {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: TransferFundsInput): Promise<TransferFundsResult> {
    if (input.amount <= 0) throw new Error('El monto debe ser mayor a cero');
    if (input.sourceJarId === input.destinationJarId) {
      throw new Error('La jarra origen y destino no pueden ser la misma');
    }

    const sourceJar = await this.jarRepo.findById(input.sourceJarId);
    if (!sourceJar) throw new Error(`Source jar ${input.sourceJarId} not found`);

    const destinationJar = await this.jarRepo.findById(input.destinationJarId);
    if (!destinationJar) throw new Error(`Destination jar ${input.destinationJarId} not found`);

    const transaction = new Transaction({
      id: input.id,
      amount: input.amount,
      jarId: sourceJar.id,
      toJarId: destinationJar.id,
      type: 'transferencia',
      description: `Transferencia a ${destinationJar.name}`,
      date: new Date(),
      workspaceId: input.workspaceId,
      userId: input.userId,
    });

    await this.transactionRepo.save(transaction);

    return { sourceJar, destinationJar, transaction };
  }
}
