/**
 * JsonDebtRepository — Adapter (mock)
 *
 * @what     Implementa IDebtRepository desde `db/debts.json`. Revive `dueDate`/`createdAt`
 *           (ISO string → Date). Estado en memoria (mock-stage).
 */
import { Debt, DebtProps } from '@core/entities/Debt';
import { IDebtRepository } from '@core/ports/IDebtRepository';
import seed from '../db/debts.json';

type DebtRow = Omit<DebtProps, 'dueDate' | 'createdAt'> & { dueDate: string; createdAt: string };

const toDebt = (row: DebtRow): Debt =>
  new Debt({ ...row, dueDate: new Date(row.dueDate), createdAt: new Date(row.createdAt) });

export class JsonDebtRepository implements IDebtRepository {
  private debts: Debt[] = (seed as unknown as DebtRow[]).map(toDebt);

  async findById(id: string): Promise<Debt | null> {
    return this.debts.find((d) => d.id === id) ?? null;
  }
  async findByWorkspace(workspaceId: string): Promise<Debt[]> {
    return this.debts.filter((d) => d.workspaceId === workspaceId);
  }
  async findOverdue(workspaceId: string): Promise<Debt[]> {
    return this.debts.filter((d) => d.workspaceId === workspaceId && d.isOverdue());
  }
  async save(debt: Debt): Promise<void> {
    this.debts = [...this.debts, debt];
  }
  async update(debt: Debt): Promise<void> {
    this.debts = this.debts.map((d) => (d.id === debt.id ? debt : d));
  }
  async delete(id: string): Promise<void> {
    this.debts = this.debts.filter((d) => d.id !== id);
  }
}
