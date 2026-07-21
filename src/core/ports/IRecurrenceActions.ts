/**
 * IRecurrenceActions — Port (acción)
 *
 * @what     Confirmar la ocurrencia de un compromiso recurrente ("Pagar" / "¡Llegó!").
 * @receives recurrenceId · recurrenceMonth ('YYYY-MM': QUÉ ocurrencia se cubre, no cuándo se pagó)
 * @processes Lo implementa `HttpRecurrenceActions` contra `POST /recurrences/:id/confirm`.
 * @returns  Promise<Transaction> — el movimiento que quedó escrito en el libro.
 *
 * Mismo motivo que [[IDebtActions]]: es una regla, no una escritura de fila.
 *
 * **Ni el monto ni el signo viajan**: salen de la regla (`rec.amount`, `rec.type`). El servidor
 * decide si suma o resta según el tipo — un gasto baja la jarra, un ingreso la sube, sin un solo
 * `if` en el cliente. Si el cliente pudiera mandarlos, confirmaría un sueldo de $3.000 por $10, o
 * convertiría un gasto en ingreso.
 *
 * **`cancel` también es acción, no `update()`**: dónde corta (última ocurrencia vencida) es una regla
 * del servidor. Devuelve la regla con su estado ya recalculado para reemplazar la fila local.
 */
import { Transaction } from '../entities/Transaction';
import type { RecurrenceWithStatus } from '../types/RecurrenceStatus';

export interface IRecurrenceActions {
  confirm(recurrenceId: string, recurrenceMonth: string): Promise<Transaction>;
  cancel(recurrenceId: string): Promise<RecurrenceWithStatus>;
}
