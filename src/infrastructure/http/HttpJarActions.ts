/**
 * HttpJarActions — Adapter (HTTP)
 *
 * @what     Implementa IJarActions contra `POST /jars/transfer`.
 * @receives sourceJarId · destinationJarId · amount
 * @processes El monto sí viaja (lo elige el usuario); el id del movimiento lo pone el servidor.
 * @returns  Promise<Transaction> — el movimiento recién escrito, listo para meter al libro local.
 *
 * Ese único movimiento mueve las DOS jarras. Ver [[IJarActions]].
 */
import { Transaction } from '@core/entities/Transaction';
import type { IJarActions } from '@core/ports/IJarActions';

import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

export class HttpJarActions implements IJarActions {
  async transfer(
    sourceJarId: string,
    destinationJarId: string,
    amount: number,
  ): Promise<Transaction> {
    const dto = await request<TransactionDto>('/jars/transfer', {
      method: 'POST',
      body: { sourceJarId, destinationJarId, amount },
    });
    return toTransaction(dto);
  }
}
