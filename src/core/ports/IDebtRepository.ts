import { Debt } from '../entities/Debt';
import { DebtWithStatus } from '../types/DebtStatus';

/**
 * Leer una deuda devuelve la deuda **y su estado** (`DebtWithStatus`): cuántas cuotas van pagadas y
 * cuáles se atrasaron sale del servidor, que es quien cruza la deuda con el libro. `findById` es la
 * excepción — lo usan los dos use-cases de cancelación, que solo necesitan la fila.
 */
export interface IDebtRepository {
  findById(id: string): Promise<Debt | null>;
  findByWorkspace(workspaceId: string): Promise<DebtWithStatus[]>;
  findOverdue(workspaceId: string): Promise<DebtWithStatus[]>;
  save(debt: Debt): Promise<void>;
  update(debt: Debt): Promise<void>;
  delete(id: string): Promise<void>;
}
