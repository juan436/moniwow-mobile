/**
 * transactionDto — Infra (HTTP)
 *
 * @what     Forma del movimiento tal como viaja por HTTP, y su traducción a entidad.
 * @receives TransactionDto (JSON de la API)
 * @processes Revive `date` (ISO string → Date), que es lo único que no sobrevive al JSON.
 * @returns  Transaction
 *
 * Vive aparte porque lo usan DOS sitios: el repo de lectura (`GET /transactions`) y los tres
 * adapters de acción, que devuelven el movimiento que acaban de escribir. Con una copia en cada uno,
 * añadir un campo al libro obligaría a acordarse de los cuatro.
 */
import { Transaction } from '@core/entities/Transaction';
import type { TransactionItem, TransactionType } from '@core/entities/Transaction';

export interface TransactionDto {
  id: string;
  amount: number;
  jarId: string;
  type: string;
  description: string;
  date: string;
  workspaceId: string;
  userId: string;
  toJarId?: string;
  debtId?: string;
  cuotaMonth?: string;
  recurrenceId?: string;
  recurrenceMonth?: string;
  items?: TransactionItem[];
  receiptUri?: string;
}

export const toTransaction = (dto: TransactionDto): Transaction =>
  new Transaction({
    ...dto,
    type: dto.type as TransactionType,
    date: new Date(dto.date),
  });
