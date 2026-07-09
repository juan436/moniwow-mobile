/**
 * JsonAgendaRepository — Adapter (mock)
 *
 * @what     Implementa IAgendaRepository desde `db/pendingItems.json`. Revive `dueDate`. PendingItem
 *           es interfaz plana (no entidad-clase). Estado en memoria (mock-stage).
 */
import { IAgendaRepository, PendingItem } from '@core/ports/IAgendaRepository';
import seed from '../db/pendingItems.json';

type PendingRow = Omit<PendingItem, 'dueDate'> & { dueDate: string };

const toPending = (row: PendingRow): PendingItem => ({ ...row, dueDate: new Date(row.dueDate) });

export class JsonAgendaRepository implements IAgendaRepository {
  private items: PendingItem[] = (seed as unknown as PendingRow[]).map(toPending);

  async findByWorkspace(workspaceId: string): Promise<PendingItem[]> {
    return this.items.filter((i) => i.workspaceId === workspaceId);
  }
  async findPending(workspaceId: string): Promise<PendingItem[]> {
    return this.items.filter((i) => i.workspaceId === workspaceId && i.status === 'pendiente');
  }
  async findOverdue(workspaceId: string): Promise<PendingItem[]> {
    const now = new Date();
    return this.items.filter(
      (i) => i.workspaceId === workspaceId && i.status !== 'confirmado' && i.dueDate < now,
    );
  }
  async save(item: PendingItem): Promise<void> {
    this.items = [...this.items, item];
  }
  async update(item: PendingItem): Promise<void> {
    this.items = this.items.map((i) => (i.id === item.id ? item : i));
  }
  async delete(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id !== id);
  }
}
