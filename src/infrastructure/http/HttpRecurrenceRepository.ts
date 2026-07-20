/**
 * HttpRecurrenceRepository — Adapter (HTTP)
 *
 * @what     Implementa IRecurrenceRepository contra `GET /recurrences`. Reemplaza al adapter JSON.
 * @receives workspaceId (ignorado: viaja en el token) · id
 * @processes Traduce el JSON a entidades `Recurrence`. Los meses son strings 'YYYY-MM', no fechas:
 *           no hay nada que revivir.
 * @returns  Promise<Recurrence[]> · Promise<Recurrence | null>
 *
 * Una recurrencia es una REGLA, no una lista de ocurrencias: las de cada mes las deriva
 * `ComputeRecurringOccurrences` cruzando la regla con el libro. Por eso acá no hay nada por mes.
 *
 * Confirmar una ocurrencia NO pasa por `save()`: va por `POST /recurrences/:id/confirm`, donde el
 * signo lo decide el `type` de la regla del lado servidor.
 */
import { Recurrence } from '@core/entities/Recurrence';
import type { RecurrenceType } from '@core/entities/Recurrence';
import type { IRecurrenceRepository } from '@core/ports/IRecurrenceRepository';

import { request } from './httpClient';

/** Forma exacta del JSON que devuelve la API. */
interface RecurrenceDto {
  id: string;
  name: string;
  amount: number;
  type: string;
  dayOfMonth: number;
  jarId: string;
  workspaceId: string;
  startMonth: string;
  endMonth?: string;
  cancelledAt?: string;
}

const toRecurrence = (dto: RecurrenceDto): Recurrence =>
  new Recurrence({ ...dto, type: dto.type as RecurrenceType });

export class HttpRecurrenceRepository implements IRecurrenceRepository {
  async findByWorkspace(_workspaceId: string): Promise<Recurrence[]> {
    const dtos = await request<RecurrenceDto[]>('/recurrences');
    return dtos.map(toRecurrence);
  }

  /** No hay `GET /recurrences/:id`: se filtra sobre la lista, que es corta. */
  async findById(id: string): Promise<Recurrence | null> {
    const recs = await this.findByWorkspace('');
    return recs.find((r) => r.id === id) ?? null;
  }

  async save(_recurrence: Recurrence): Promise<void> {
    throw new Error('Crear compromiso recurrente todavía no existe en la API (falta POST /recurrences)');
  }

  async update(_recurrence: Recurrence): Promise<void> {
    throw new Error(
      'Editar o cancelar un recurrente todavía no existe en la API (falta PATCH /recurrences/:id)',
    );
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Borrar compromiso recurrente todavía no existe en la API (falta DELETE /recurrences/:id)');
  }
}
