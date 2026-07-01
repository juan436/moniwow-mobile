import { Debt } from '../entities/Debt';

export interface IDebtRepository {
  findById(id: string): Promise<Debt | null>;
  findByWorkspace(workspaceId: string): Promise<Debt[]>;
  findOverdue(workspaceId: string): Promise<Debt[]>;
  save(debt: Debt): Promise<void>;
  update(debt: Debt): Promise<void>;
  delete(id: string): Promise<void>;
}
