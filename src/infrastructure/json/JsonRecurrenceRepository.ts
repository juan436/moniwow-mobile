/**
 * JsonRecurrenceRepository — Adapter (mock)
 *
 * @what     Implementa IRecurrenceRepository desde `db/recurrences.json`. Estado en memoria
 *           (mock-stage). Reemplaza los `pendingItems` recurrentes: la regla se guarda aquí, las
 *           ocurrencias del mes se derivan con `ComputeRecurringOccurrences`.
 */
import { Recurrence, RecurrenceProps } from '@core/entities/Recurrence';
import { IRecurrenceRepository } from '@core/ports/IRecurrenceRepository';
import seed from '../db/recurrences.json';

const toRecurrence = (row: RecurrenceProps): Recurrence => new Recurrence(row);

export class JsonRecurrenceRepository implements IRecurrenceRepository {
  private recurrences: Recurrence[] = (seed as unknown as RecurrenceProps[]).map(toRecurrence);

  async findById(id: string): Promise<Recurrence | null> {
    return this.recurrences.find((r) => r.id === id) ?? null;
  }
  async findByWorkspace(workspaceId: string): Promise<Recurrence[]> {
    return this.recurrences.filter((r) => r.workspaceId === workspaceId);
  }
  async save(recurrence: Recurrence): Promise<void> {
    this.recurrences = [...this.recurrences, recurrence];
  }
  async update(recurrence: Recurrence): Promise<void> {
    this.recurrences = this.recurrences.map((r) => (r.id === recurrence.id ? recurrence : r));
  }
  async delete(id: string): Promise<void> {
    this.recurrences = this.recurrences.filter((r) => r.id !== id);
  }
}
