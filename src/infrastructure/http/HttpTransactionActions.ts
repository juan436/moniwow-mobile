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
import type {
  CreateTransactionInput,
  DistributeInput,
  ITransactionActions,
} from '@core/ports/ITransactionActions';

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

  /** Ingreso + reparto. La API devuelve el ingreso primero y luego las transferencias. */
  async distribute(input: DistributeInput): Promise<Transaction[]> {
    const dtos = await request<TransactionDto[]>('/transactions/distribute', {
      method: 'POST',
      body: input,
    });
    return dtos.map(toTransaction);
  }
}
