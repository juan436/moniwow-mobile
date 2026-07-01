import { Jar } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface TransferFundsInput {
  idOut: string;
  idIn: string;
  sourceJarId: string;
  destinationJarId: string;
  amount: number;
  workspaceId: string;
  userId: string;
}

export interface TransferFundsResult {
  sourceJar: Jar;
  destinationJar: Jar;
  transactionOut: Transaction;
  transactionIn: Transaction;
}

export class TransferFunds {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: TransferFundsInput): Promise<TransferFundsResult> {
    const sourceJar = await this.jarRepo.findById(input.sourceJarId);
    if (!sourceJar) throw new Error(`Source jar ${input.sourceJarId} not found`);

    const destinationJar = await this.jarRepo.findById(input.destinationJarId);
    if (!destinationJar) throw new Error(`Destination jar ${input.destinationJarId} not found`);

    sourceJar.balance -= input.amount;
    destinationJar.balance += input.amount;

    const now = new Date();

    const transactionOut = new Transaction({
      id: input.idOut,
      amount: input.amount,
      jarId: sourceJar.id,
      type: 'transferencia',
      description: `Transferencia a ${destinationJar.name}`,
      date: now,
      workspaceId: input.workspaceId,
      userId: input.userId,
      isHormiga: false,
    });

    const transactionIn = new Transaction({
      id: input.idIn,
      amount: input.amount,
      jarId: destinationJar.id,
      type: 'transferencia',
      description: `Transferencia desde ${sourceJar.name}`,
      date: now,
      workspaceId: input.workspaceId,
      userId: input.userId,
      isHormiga: false,
    });

    await this.jarRepo.update(sourceJar);
    await this.jarRepo.update(destinationJar);
    await this.transactionRepo.save(transactionOut);
    await this.transactionRepo.save(transactionIn);

    return { sourceJar, destinationJar, transactionOut, transactionIn };
  }
}
