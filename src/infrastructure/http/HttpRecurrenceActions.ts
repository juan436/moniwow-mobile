/**
 * HttpRecurrenceActions — Adapter (HTTP)
 *
 * @what     Implementa IRecurrenceActions contra `POST /recurrences/:id/confirm`.
 * @receives recurrenceId · recurrenceMonth
 * @processes Manda SOLO el mes. El monto y el signo salen de la regla, del lado servidor.
 * @returns  Promise<Transaction> — el movimiento recién escrito, listo para meter al libro local.
 */
import { Transaction } from '@core/entities/Transaction';
import type { IRecurrenceActions } from '@core/ports/IRecurrenceActions';

import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

export class HttpRecurrenceActions implements IRecurrenceActions {
  async confirm(recurrenceId: string, recurrenceMonth: string): Promise<Transaction> {
    const dto = await request<TransactionDto>(`/recurrences/${recurrenceId}/confirm`, {
      method: 'POST',
      body: { recurrenceMonth },
    });
    return toTransaction(dto);
  }
}
