/**
 * JsonTransactionRepository — Adapter (mock)
 *
 * @what     Implementa ITransactionRepository desde `db/transactions.json`. Revive `date` (ISO
 *           string → Date). Estado en memoria (mock-stage).
 */
import { Transaction, TransactionProps } from '@core/entities/Transaction';
import { ITransactionRepository } from '@core/ports/ITransactionRepository';
import seed from '../db/transactions.json';

type TransactionRow = Omit<TransactionProps, 'date'> & { date: string };

const toTransaction = (row: TransactionRow): Transaction =>
  new Transaction({ ...row, date: new Date(row.date) });

export class JsonTransactionRepository implements ITransactionRepository {
  private txs: Transaction[] = (seed as unknown as TransactionRow[]).map(toTransaction);

  async findById(id: string): Promise<Transaction | null> {
    return this.txs.find((t) => t.id === id) ?? null;
  }
  async findByJar(jarId: string): Promise<Transaction[]> {
    return this.txs.filter((t) => t.jarId === jarId);
  }
  async findByWorkspace(workspaceId: string): Promise<Transaction[]> {
    return this.txs.filter((t) => t.workspaceId === workspaceId);
  }
  async findHormigas(workspaceId: string): Promise<Transaction[]> {
    return this.txs.filter((t) => t.workspaceId === workspaceId && t.isHormiga());
  }
  async save(transaction: Transaction): Promise<void> {
    this.txs = [...this.txs, transaction];
  }
  async update(transaction: Transaction): Promise<void> {
    this.txs = this.txs.map((t) => (t.id === transaction.id ? transaction : t));
  }
  async delete(id: string): Promise<void> {
    this.txs = this.txs.filter((t) => t.id !== id);
  }
}
