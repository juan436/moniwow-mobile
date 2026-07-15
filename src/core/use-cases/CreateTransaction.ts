/**
 * CreateTransaction — Use Case
 *
 * @what     Registra un movimiento en el libro (Quick Add). Es la única forma de que exista dinero
 *           gastado o ingresado.
 * @receives CreateTransactionInput — monto, tipo, jarra, concepto y, opcional, el desglose de ítems.
 * @processes Valida el monto y que la jarra exista. Si no se indica jarra, cae en `libre` (dinero no
 *           asignado). NO toca el balance: se deriva del libro (C4, ComputeJarBalances). NO guarda
 *           `isHormiga`: es una regla derivada (`Transaction.isHormiga()`).
 * @returns  { transaction, jar }
 */
import { Jar, JarType } from '../entities/Jar';
import { Transaction, TransactionItem, TransactionType } from '../entities/Transaction';
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
  items?: TransactionItem[];
  date?: Date;
  receiptUri?: string;
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
    if (input.amount <= 0) throw new Error('El monto debe ser mayor a cero');

    let jar: Jar | null = null;

    if (input.jarId) {
      jar = await this.jarRepo.findById(input.jarId);
      if (!jar) throw new Error(`Jar ${input.jarId} not found`);
    } else {
      // Sin jarra elegida, el dinero sale del bolsillo no asignado.
      const jars = await this.jarRepo.findByWorkspace(input.workspaceId);
      jar = jars.find((j) => j.type === ('libre' as JarType)) ?? null;
      if (!jar) throw new Error('Libre jar not found for workspace');
    }

    const transaction = new Transaction({
      id: input.id,
      amount: input.amount,
      jarId: jar.id,
      type: input.type,
      description: input.description,
      date: input.date ?? new Date(),
      workspaceId: input.workspaceId,
      userId: input.userId,
      items: input.items,
      receiptUri: input.receiptUri,
    });

    await this.transactionRepo.save(transaction);

    return { transaction, jar };
  }
}
