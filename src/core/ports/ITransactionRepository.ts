import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByJar(jarId: string): Promise<Transaction[]>;
  findByWorkspace(workspaceId: string): Promise<Transaction[]>;
  findHormigas(workspaceId: string): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
}
