/**
 * ITransactionActions — Port (acción)
 *
 * @what     Registrar un movimiento en el libro (Quick Add).
 * @receives amount · description · type · jarId opcional · items opcionales
 * @processes Lo implementa `HttpTransactionActions` contra `POST /transactions`.
 * @returns  Promise<Transaction> — el movimiento que quedó escrito.
 *
 * Mismo motivo que [[IDebtActions]]: registrar un gasto es una regla, no una escritura de fila. La
 * jarra por defecto (`libre` cuando no se elige, que es lo que hace hormiga a un gasto) la decide el
 * servidor — si la decidiera el cliente, dos apps podrían discrepar sobre qué es un gasto hormiga.
 *
 * **`type` no admite 'transferencia'**: mover dinero entre jarras tiene su propio camino
 * ([[IJarActions]]), donde un solo movimiento mueve las dos jarras. Dejarlo aquí permitiría escribir
 * media transferencia y evaporar dinero.
 *
 * **La fecha no viaja**: el movimiento se registra cuando ocurre. Con el reloj del teléfono mal
 * puesto, los totales del mes saldrían torcidos.
 */
import { Transaction } from '../entities/Transaction';

export interface CreateTransactionItem {
  name: string;
  amount?: number;
}

export interface CreateTransactionInput {
  amount: number;
  description: string;
  type: 'gasto' | 'ingreso';
  jarId?: string;
  items?: CreateTransactionItem[];
  receiptUri?: string;
}

export interface ITransactionActions {
  create(input: CreateTransactionInput): Promise<Transaction>;
}
