import { Jar } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';
import { IJarRepository } from '../ports/IJarRepository';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { IAgendaRepository, PendingItem } from '../ports/IAgendaRepository';

export interface ConfirmIncomeInput {
  transactionId: string;
  pendingItemId: string;
  workspaceId: string;
  userId: string;
}

export interface ConfirmIncomeResult {
  transaction: Transaction;
  jar: Jar;
  pendingItem: PendingItem;
}

export class ConfirmIncome {
  constructor(
    private readonly jarRepo: IJarRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly agendaRepo: IAgendaRepository,
  ) {}

  async execute(input: ConfirmIncomeInput): Promise<ConfirmIncomeResult> {
    const pendingItem = await this.agendaRepo.findByWorkspace(input.workspaceId)
      .then((items) => items.find((i) => i.id === input.pendingItemId) ?? null);

    if (!pendingItem) throw new Error(`Pending item ${input.pendingItemId} not found`);
    if (pendingItem.type !== 'ingreso') throw new Error('Only income items can be confirmed here');

    const jar = await this.jarRepo.findById(pendingItem.jarId);
    if (!jar) throw new Error(`Jar ${pendingItem.jarId} not found`);

    jar.balance += pendingItem.amount;

    const transaction = new Transaction({
      id: input.transactionId,
      amount: pendingItem.amount,
      jarId: jar.id,
      type: 'ingreso',
      description: pendingItem.description,
      date: new Date(),
      workspaceId: input.workspaceId,
      userId: input.userId,
      isHormiga: false,
    });

    const confirmedItem: PendingItem = { ...pendingItem, status: 'confirmado' };

    await this.jarRepo.update(jar);
    await this.transactionRepo.save(transaction);
    await this.agendaRepo.update(confirmedItem);

    return { transaction, jar, pendingItem: confirmedItem };
  }
}
