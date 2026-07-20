/**
 * HttpTransactionRepository — Adapter (HTTP)
 *
 * @what     Implementa ITransactionRepository contra `GET /transactions`. Reemplaza al adapter JSON.
 * @receives jarId / workspaceId según el método.
 * @processes Pide el libro a la API y revive `date` (ISO string → Date), que es lo único que no
 *           sobrevive al JSON.
 * @returns  Promise<Transaction[]> · Promise<Transaction | null>
 *
 * El libro es la fuente de casi todo lo derivado (saldos, cuotas pagadas, ocurrencias confirmadas),
 * así que los enlaces `debtId`/`cuotaMonth`/`recurrenceId`/`recurrenceMonth` tienen que llegar
 * enteros: sin ellos `ComputeDebtStatus` daría todas las cuotas por impagas.
 *
 * `findHormigas` filtra acá y no por HTTP: `isHormiga()` es una regla derivada de la entidad
 * (gasto + jarra `libre`), y un endpoint aparte para eso sería una segunda copia de la regla.
 */
import { Transaction } from '@core/entities/Transaction';
import type { ITransactionRepository } from '@core/ports/ITransactionRepository';

import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

export class HttpTransactionRepository implements ITransactionRepository {
  async findByWorkspace(_workspaceId: string): Promise<Transaction[]> {
    const dtos = await request<TransactionDto[]>('/transactions');
    return dtos.map(toTransaction);
  }

  async findByJar(jarId: string): Promise<Transaction[]> {
    const dtos = await request<TransactionDto[]>(`/transactions?jarId=${jarId}`);
    return dtos.map(toTransaction);
  }

  async findHormigas(workspaceId: string): Promise<Transaction[]> {
    const txs = await this.findByWorkspace(workspaceId);
    return txs.filter((t) => t.isHormiga);
  }

  /** No hay `GET /transactions/:id`: se filtra sobre el libro, que ya viene entero. */
  async findById(id: string): Promise<Transaction | null> {
    const txs = await this.findByWorkspace('');
    return txs.find((t) => t.id === id) ?? null;
  }

  async save(_transaction: Transaction): Promise<void> {
    throw new Error(
      'Escribir en el libro no pasa por acá: va por los endpoints de acción (pay-cuota, confirm, transfer)',
    );
  }

  async update(_transaction: Transaction): Promise<void> {
    throw new Error('Editar un movimiento todavía no existe en la API');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Borrar un movimiento todavía no existe en la API');
  }
}
