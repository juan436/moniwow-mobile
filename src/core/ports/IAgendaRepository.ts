export type PendingItemType = 'ingreso' | 'pago';
export type PendingItemStatus = 'pendiente' | 'confirmado' | 'atrasado';

export interface PendingItem {
  id: string;
  description: string;
  amount: number;
  type: PendingItemType;
  status: PendingItemStatus;
  dueDate: Date;
  jarId: string;
  workspaceId: string;
  isRecurring: boolean;
  recurrenceDayOfMonth?: number;
}

export interface IAgendaRepository {
  findByWorkspace(workspaceId: string): Promise<PendingItem[]>;
  findPending(workspaceId: string): Promise<PendingItem[]>;
  findOverdue(workspaceId: string): Promise<PendingItem[]>;
  save(item: PendingItem): Promise<void>;
  update(item: PendingItem): Promise<void>;
  delete(id: string): Promise<void>;
}
