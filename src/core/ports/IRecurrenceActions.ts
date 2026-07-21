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
 *
 * **`create`/`update` reciben el FORM, no la entidad**: `startMonth`/`endMonth` y (en edición) la
 * preservación de `startMonth`/`cancelledAt` los resuelve el servidor — la lógica de `buildRecurrence`
 * se mudó allá. Devuelven la regla con su estado del libro.
 */
import { Transaction } from '../entities/Transaction';
import type { RecurrenceWithStatus } from '../types/RecurrenceStatus';

/** Datos del wizard. `amount` es el monto MENSUAL. `cuotas` = duración cuando `frecuencia` es 'cuotas'. */
export interface RecurrenceWriteInput {
  name: string;
  amount: number;
  day: number;
  type: 'ingreso' | 'gasto';
  jarId: string;
  frecuencia: 'indefinido' | 'cuotas';
  cuotas: number;
}

export interface IRecurrenceActions {
  confirm(recurrenceId: string, recurrenceMonth: string): Promise<Transaction>;
  cancel(recurrenceId: string): Promise<RecurrenceWithStatus>;
  create(input: RecurrenceWriteInput): Promise<RecurrenceWithStatus>;
  update(recurrenceId: string, input: RecurrenceWriteInput): Promise<RecurrenceWithStatus>;
  remove(recurrenceId: string): Promise<void>;
}
