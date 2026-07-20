import { Recurrence } from '../entities/Recurrence';
import { RecurrenceWithStatus } from '../types/RecurrenceStatus';

/**
 * Espejo de `IDebtRepository`: leer devuelve la regla **y sus ocurrencias** derivadas del libro por el
 * servidor. `findById` devuelve solo la fila — lo usa `CancelRecurrence`.
 */
export interface IRecurrenceRepository {
  findById(id: string): Promise<Recurrence | null>;
  findByWorkspace(workspaceId: string): Promise<RecurrenceWithStatus[]>;
  save(recurrence: Recurrence): Promise<void>;
  update(recurrence: Recurrence): Promise<void>;
  delete(id: string): Promise<void>;
}
