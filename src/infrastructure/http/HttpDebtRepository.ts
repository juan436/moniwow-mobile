/**
 * HttpDebtRepository — Adapter (HTTP)
 *
 * @what     Implementa IDebtRepository contra `GET /debts`. Reemplaza a `JsonDebtRepository`.
 * @receives workspaceId (ignorado: viaja en el token) · id
 * @processes Traduce el JSON a entidades `Debt`, reviviendo `createdAt`.
 * @returns  Promise<Debt[]> · Promise<Debt | null>
 *
 * **`findOverdue` devuelve las deudas vivas, no las atrasadas** — igual que hacía el adapter JSON, y
 * por la misma razón: si una cuota está atrasada depende del LIBRO (qué cuotas se pagaron), no de la
 * fila de la deuda. Lo responde `ComputeDebtStatus` cruzando ambas cosas. Un endpoint `/debts/overdue`
 * sería una segunda copia de esa regla.
 *
 * Pagar una cuota NO pasa por `save()`: va por `POST /debts/:id/pay-cuota`, donde el servidor calcula
 * el monto. Ver la decisión B en [[planes/backend-api]].
 */
import { Debt } from '@core/entities/Debt';
import type { DebtOrigin } from '@core/entities/Debt';
import type { IDebtRepository } from '@core/ports/IDebtRepository';

import { request } from './httpClient';

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
}

const toDebt = (dto: DebtDto): Debt =>
  new Debt({
    ...dto,
    origin: dto.origin as DebtOrigin,
    createdAt: new Date(dto.createdAt),
  });

export class HttpDebtRepository implements IDebtRepository {
  async findByWorkspace(_workspaceId: string): Promise<Debt[]> {
    const dtos = await request<DebtDto[]>('/debts');
    return dtos.map(toDebt);
  }

  /** Deudas vivas para que `ComputeDebtStatus` las cruce con el libro. Ver el docstring de arriba. */
  async findOverdue(workspaceId: string): Promise<Debt[]> {
    return this.findByWorkspace(workspaceId);
  }

  /** No hay `GET /debts/:id`: se filtra sobre la lista. */
  async findById(id: string): Promise<Debt | null> {
    const debts = await this.findByWorkspace('');
    return debts.find((d) => d.id === id) ?? null;
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
