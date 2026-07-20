/**
 * HttpDebtActions — Adapter (HTTP)
 *
 * @what     Implementa IDebtActions contra `POST /debts/:id/pay-cuota`.
 * @receives debtId · cuotaMonth
 * @processes Manda SOLO el mes. El monto, el id del movimiento y la jarra de origen los pone el
 *           servidor a partir de la deuda.
 * @returns  Promise<Transaction> — el movimiento recién escrito, listo para meter al libro local.
 *
 * Los errores del dominio llegan como `HttpError` con el mensaje de la API, que está en español y
 * pensado para leerse ("Esa cuota ya está pagada"). No hace falta traducirlos acá.
 */
import { Transaction } from '@core/entities/Transaction';
import type { IDebtActions } from '@core/ports/IDebtActions';

import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

export class HttpDebtActions implements IDebtActions {
  async payCuota(debtId: string, cuotaMonth: string): Promise<Transaction> {
    const dto = await request<TransactionDto>(`/debts/${debtId}/pay-cuota`, {
      method: 'POST',
      body: { cuotaMonth },
    });
    return toTransaction(dto);
  }
}
