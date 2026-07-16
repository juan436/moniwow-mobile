import { Recurrence } from '../entities/Recurrence';

export interface IRecurrenceRepository {
  findById(id: string): Promise<Recurrence | null>;
  findByWorkspace(workspaceId: string): Promise<Recurrence[]>;
  save(recurrence: Recurrence): Promise<void>;
  update(recurrence: Recurrence): Promise<void>;
  delete(id: string): Promise<void>;
}
