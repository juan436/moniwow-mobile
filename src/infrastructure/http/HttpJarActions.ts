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
import { Jar } from '@core/entities/Jar';
import { Transaction } from '@core/entities/Transaction';
import type { CreateJarInput, IJarActions, UpdateJarInput } from '@core/ports/IJarActions';

import { toJar, type JarDto } from './HttpJarRepository';
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

  /** Crea una jarra personalizada. El id y el tipo (`custom`) los pone el servidor; devuelve la jarra. */
  async create(input: CreateJarInput): Promise<Jar> {
    const dto = await request<JarDto>('/jars', { method: 'POST', body: input });
    return toJar(dto);
  }

  /** Edita una jarra. El servidor aplica el candado de capacidades y devuelve la jarra con su balance real. */
  async update(jarId: string, input: UpdateJarInput): Promise<Jar> {
    const dto = await request<JarDto>(`/jars/${jarId}`, { method: 'PATCH', body: input });
    return toJar(dto);
  }

  /** Borra una jarra. Una jarra base la rechaza el servidor (409). */
  async remove(jarId: string): Promise<void> {
    await request<void>(`/jars/${jarId}`, { method: 'DELETE' });
  }
}
