/**
 * HttpRecurrenceRepository — Adapter (HTTP)
 *
 * @what     Implementa IRecurrenceRepository contra `GET /recurrences`. Reemplaza al adapter JSON.
 * @receives workspaceId (ignorado: viaja en el token) · id
 * @processes Traduce el JSON a `RecurrenceWithStatus`: la regla **y sus ocurrencias**, que ahora
 *           deriva el servidor (`FindRecurrencesByWorkspace`).
 * @returns  Promise<RecurrenceWithStatus[]> · Promise<Recurrence | null>
 *
 * Una recurrencia sigue siendo una REGLA, no una lista de ocurrencias — pero quién las deriva cambió:
 * `ComputeRecurringOccurrences` **ya no vive en mobile**. Además del ahorro, es lo único que funciona
 * para un cron de notificaciones: no puede preguntarle al teléfono qué ocurrencias existen.
 *
 * `findById` devuelve la regla sola — lo usa `CancelRecurrence`, que solo escribe `endMonth`.
 *
 * Confirmar una ocurrencia NO pasa por `save()`: va por `POST /recurrences/:id/confirm`, donde el
 * signo lo decide el `type` de la regla del lado servidor.
 */
import { Recurrence } from '@core/entities/Recurrence';
import type { RecurrenceType } from '@core/entities/Recurrence';
import type { IRecurrenceRepository } from '@core/ports/IRecurrenceRepository';
import type { RecurrenceOccurrence, RecurrenceWithStatus } from '@core/types/RecurrenceStatus';

import { request } from './httpClient';

interface OccurrenceDto {
  month: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

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
  overdue: OccurrenceDto[];
  current: OccurrenceDto | null;
}

const toOccurrence = (dto: OccurrenceDto): RecurrenceOccurrence => ({
  ...dto,
  dueDate: new Date(dto.dueDate),
});

const toRecurrence = (dto: RecurrenceDto): Recurrence =>
  new Recurrence({
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    type: dto.type as RecurrenceType,
    dayOfMonth: dto.dayOfMonth,
    jarId: dto.jarId,
    workspaceId: dto.workspaceId,
    startMonth: dto.startMonth,
    endMonth: dto.endMonth,
    cancelledAt: dto.cancelledAt,
  });

const toRecurrenceWithStatus = (dto: RecurrenceDto): RecurrenceWithStatus => ({
  recurrence: toRecurrence(dto),
  status: {
    overdue: dto.overdue.map(toOccurrence),
    current: dto.current ? toOccurrence(dto.current) : null,
  },
});

export class HttpRecurrenceRepository implements IRecurrenceRepository {
  async findByWorkspace(_workspaceId: string): Promise<RecurrenceWithStatus[]> {
    const dtos = await request<RecurrenceDto[]>('/recurrences');
    return dtos.map(toRecurrenceWithStatus);
  }

  /** No hay `GET /recurrences/:id`: se filtra sobre la lista, que es corta. */
  async findById(id: string): Promise<Recurrence | null> {
    const dtos = await request<RecurrenceDto[]>('/recurrences');
    const found = dtos.find((r) => r.id === id);
    return found ? toRecurrence(found) : null;
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
