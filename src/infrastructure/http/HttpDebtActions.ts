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
import type { DebtWriteInput, IDebtActions } from '@core/ports/IDebtActions';
import type { DebtWithStatus } from '@core/types/DebtStatus';

import { toDebtWithStatus, type DebtDto } from './HttpDebtRepository';
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

  /**
   * Cancela la deuda. La API devuelve la fila con su estado recalculado (cuotas vivas/atrasadas), que
   * se reusa el MISMO mapper que `GET /debts` — misma forma, una sola traducción.
   */
  async cancel(debtId: string): Promise<DebtWithStatus> {
    const dto = await request<DebtDto>(`/debts/${debtId}/cancel`, { method: 'POST' });
    return toDebtWithStatus(dto);
  }

  /** Registra una deuda desde el form. El total, el id y el calendario los pone el servidor. */
  async create(input: DebtWriteInput): Promise<DebtWithStatus> {
    const dto = await request<DebtDto>('/debts', { method: 'POST', body: input });
    return toDebtWithStatus(dto);
  }

  /** Edita una deuda. Preserva `createdAt`/`cancelledAt`; devuelve el estado recalculado. */
  async update(debtId: string, input: DebtWriteInput): Promise<DebtWithStatus> {
    const dto = await request<DebtDto>(`/debts/${debtId}`, { method: 'PATCH', body: input });
    return toDebtWithStatus(dto);
  }

  /** Borra una deuda sin pagos (con pagos la API responde 409). */
  async remove(debtId: string): Promise<void> {
    await request<void>(`/debts/${debtId}`, { method: 'DELETE' });
  }
}
