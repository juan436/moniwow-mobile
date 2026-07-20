/**
 * RecurrenceStatus — Types de dominio
 *
 * @what     El estado de una regla recurrente: qué ocurrencia toca este mes y cuáles se atrasaron.
 * @receives —
 * @processes Nada. Son la forma de lo que `GET /recurrences` devuelve.
 * @returns  —
 *
 * Espejo de [[DebtStatus]]. Lo calculaba `ComputeRecurringOccurrences` en mobile; **ahora lo hace el
 * servidor** (`FindRecurrencesByWorkspace`), que además es el único que puede: un cron de
 * notificaciones no puede preguntarle al teléfono qué ocurrencias existen.
 */
import type { Recurrence } from '../entities/Recurrence';

export interface RecurrenceOccurrence {
  /** Mes que cubre la ocurrencia, 'YYYY-MM'. Es su identidad: la de julio es la de julio. */
  month: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
}

export interface RecurrenceStatus {
  /** Ocurrencias de meses anteriores, sin pagar. Las más viejas primero. */
  overdue: RecurrenceOccurrence[];
  /** La de este mes, si la regla ya empezó y sigue viva. */
  current: RecurrenceOccurrence | null;
}

export interface RecurrenceWithStatus {
  recurrence: Recurrence;
  status: RecurrenceStatus;
}
