export type NotificationType = 'jarra_negativa' | 'deuda_atrasada' | 'meta_estrella' | 'hormiga_alerta';

export interface INotificationPort {
  send(type: NotificationType, payload: Record<string, string | number>): Promise<void>;
  scheduleReminder(itemId: string, dueDate: Date, message: string): Promise<void>;
  cancelReminder(itemId: string): Promise<void>;
}
