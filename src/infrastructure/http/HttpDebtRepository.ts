/**
 * HttpDebtRepository — Adapter (HTTP)
 *
 * @what     Implementa IDebtRepository contra `GET /debts`. Reemplaza a `JsonDebtRepository`.
 * @receives workspaceId (ignorado: viaja en el token) · id
 * @processes Traduce el JSON a `DebtWithStatus`: la entidad `Debt` **y su estado derivado del libro**,
 *           que ahora calcula el servidor (`FindDebtsByWorkspace`).
 * @returns  Promise<DebtWithStatus[]> · Promise<Debt | null>
 *
 * **`ComputeDebtStatus` ya no vive en mobile**: qué cuotas van pagadas y cuáles se atrasaron llega
 * hecho. Antes el front cruzaba cada deuda con el libro entero, así que necesitaba el libro entero.
 *
 * `findOverdue` sigue devolviendo las deudas VIVAS, no un subconjunto atrasado: quien las pinta ya
 * tiene `status.overdue` de cada una. Un endpoint `/debts/overdue` sería una segunda copia de la regla.
 *
 * `findById` devuelve la fila sola — lo usa `CancelDebt`, que solo necesita escribir `cancelledAt`.
 *
 * Pagar una cuota NO pasa por `save()`: va por `POST /debts/:id/pay-cuota`, donde el servidor calcula
 * el monto. Ver la decisión B en [[planes/backend-api]].
 */
import { Debt } from '@core/entities/Debt';
import type { DebtOrigin } from '@core/entities/Debt';
import type { IDebtRepository } from '@core/ports/IDebtRepository';
import type { CuotaStatus, DebtWithStatus } from '@core/types/DebtStatus';

import { request } from './httpClient';

interface CuotaDto {
  month: string;
  number: number;
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

/** Forma exacta del JSON. `totalCuotas`/`cuotaAmount` llegan pero la entidad los recalcula. */
interface DebtDto {
  id: string;
  description: string;
  amount: number;
  dueDay: number;
  cuotas?: number;
  cuotasPagadas?: number;
  cancelledAt?: string;
  sourceJarId: string;
  workspaceId: string;
  createdAt: string;
  origin: string;
  liveCuotas: number;
  paidCount: number;
  remaining: number;
  isPaid: boolean;
  overdue: CuotaDto[];
  current: CuotaDto | null;
}

const toCuota = (dto: CuotaDto): CuotaStatus => ({ ...dto, dueDate: new Date(dto.dueDate) });

const toDebt = (dto: DebtDto): Debt =>
  new Debt({
    id: dto.id,
    description: dto.description,
    amount: dto.amount,
    dueDay: dto.dueDay,
    cuotas: dto.cuotas,
    cuotasPagadas: dto.cuotasPagadas,
    cancelledAt: dto.cancelledAt,
    sourceJarId: dto.sourceJarId,
    workspaceId: dto.workspaceId,
    createdAt: new Date(dto.createdAt),
    origin: dto.origin as DebtOrigin,
  });

const toDebtWithStatus = (dto: DebtDto): DebtWithStatus => ({
  debt: toDebt(dto),
  status: {
    paidCount: dto.paidCount,
    totalCuotas: dto.liveCuotas,
    remaining: dto.remaining,
    isPaid: dto.isPaid,
    overdue: dto.overdue.map(toCuota),
    current: dto.current ? toCuota(dto.current) : null,
  },
});

export class HttpDebtRepository implements IDebtRepository {
  async findByWorkspace(_workspaceId: string): Promise<DebtWithStatus[]> {
    const dtos = await request<DebtDto[]>('/debts');
    return dtos.map(toDebtWithStatus);
  }

  /** Deudas vivas con su estado. Ver el docstring de arriba. */
  async findOverdue(workspaceId: string): Promise<DebtWithStatus[]> {
    return this.findByWorkspace(workspaceId);
  }

  /** No hay `GET /debts/:id`: se filtra sobre la lista. */
  async findById(id: string): Promise<Debt | null> {
    const dtos = await request<DebtDto[]>('/debts');
    const found = dtos.find((d) => d.id === id);
    return found ? toDebt(found) : null;
  }

  async save(_debt: Debt): Promise<void> {
    throw new Error('Crear deuda todavía no existe en la API (falta POST /debts)');
  }

  async update(_debt: Debt): Promise<void> {
    throw new Error('Editar o cancelar deuda todavía no existe en la API (falta PATCH /debts/:id)');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Borrar deuda todavía no existe en la API (falta DELETE /debts/:id)');
  }
}
