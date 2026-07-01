import { Jar, JarType } from '../entities/Jar';
import { Transaction, TransactionType } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';

export interface CreateTransactionInput {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  workspaceId: string;
  userId: string;
  jarId?: string;
}

export interface CreateTransactionResult {
  transaction: Transaction;
  jar: Jar;
}

export class CreateTransaction {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: CreateTransactionInput): Promise<CreateTransactionResult> {
    let jar: Jar | null = null;
    let isHormiga = false;

    if (input.jarId) {
      jar = await this.jarRepo.findById(input.jarId);
      if (!jar) throw new Error(`Jar ${input.jarId} not found`);
    } else {
      const jars = await this.jarRepo.findByWorkspace(input.workspaceId);
      jar = jars.find((j) => j.type === ('libre' as JarType)) ?? null;
      if (!jar) throw new Error('Libre jar not found for workspace');
      isHormiga = true;
    }

    if (input.type === 'gasto') {
      jar.balance -= input.amount;
    } else if (input.type === 'ingreso') {
      jar.balance += input.amount;
    }

    const transaction = new Transaction({
      id: input.id,
      amount: input.amount,
      jarId: jar.id,
      type: input.type,
      description: input.description,
      date: new Date(),
      workspaceId: input.workspaceId,
      userId: input.userId,
      isHormiga,
    });

    await this.jarRepo.update(jar);
    await this.transactionRepo.save(transaction);

    return { transaction, jar };
  }
}
