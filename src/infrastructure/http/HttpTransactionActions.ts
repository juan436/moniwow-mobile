/**
 * HttpTransactionActions — Adapter (HTTP)
 *
 * @what     Implementa ITransactionActions contra `POST /transactions`.
 * @receives CreateTransactionInput
 * @processes Manda el cuerpo tal cual. El id del movimiento, el de cada ítem, la fecha y la jarra por
 *           defecto los pone el servidor.
 * @returns  Promise<Transaction> — el movimiento recién escrito, listo para meter al libro local.
 */
import { Transaction } from '@core/entities/Transaction';
import type { CreateTransactionInput, ITransactionActions } from '@core/ports/ITransactionActions';

import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

export class HttpTransactionActions implements ITransactionActions {
  async create(input: CreateTransactionInput): Promise<Transaction> {
    const dto = await request<TransactionDto>('/transactions', {
      method: 'POST',
      body: input,
    });
    return toTransaction(dto);
  }
}
