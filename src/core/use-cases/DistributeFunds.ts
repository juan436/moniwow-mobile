import { Jar } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface DistributionEntry {
  transactionId: string;
  jarId: string;
  amount: number;
}

export interface DistributeFundsInput {
  totalAmount: number;
  distribution: DistributionEntry[];
  workspaceId: string;
  userId: string;
  description: string;
}

export interface DistributeFundsResult {
  updatedJars: Jar[];
  transactions: Transaction[];
}

export class DistributeFunds {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: DistributeFundsInput): Promise<DistributeFundsResult> {
    const distributed = input.distribution.reduce((sum, e) => sum + e.amount, 0);
    if (distributed > input.totalAmount) {
      throw new Error('Distribution exceeds total amount');
    }

    const updatedJars: Jar[] = [];
    const transactions: Transaction[] = [];
    const now = new Date();

    for (const entry of input.distribution) {
      const jar = await this.jarRepo.findById(entry.jarId);
      if (!jar) throw new Error(`Jar ${entry.jarId} not found`);

      jar.balance += entry.amount;

      const transaction = new Transaction({
        id: entry.transactionId,
        amount: entry.amount,
        jarId: jar.id,
        type: 'ingreso',
        description: input.description,
        date: now,
        workspaceId: input.workspaceId,
        userId: input.userId,
        isHormiga: false,
      });

      await this.jarRepo.update(jar);
      await this.transactionRepo.save(transaction);

      updatedJars.push(jar);
      transactions.push(transaction);
    }

    return { updatedJars, transactions };
  }
}
