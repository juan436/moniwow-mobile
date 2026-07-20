/**
 * IJarActions — Port (acción)
 *
 * @what     Mover dinero entre dos jarras (transferir y reequilibrar).
 * @receives sourceJarId · destinationJarId · amount
 * @processes Lo implementa `HttpJarActions` contra `POST /jars/transfer`.
 * @returns  Promise<Transaction> — el movimiento que quedó escrito en el libro.
 *
 * Mismo motivo que [[IDebtActions]]: es una regla, no una escritura de fila.
 *
 * **Acá el `amount` SÍ viaja**: en una transferencia lo elige el usuario, no lo dicta ninguna regla
 * — a diferencia de una cuota, cuyo monto sale de la deuda.
 *
 * **Una sola transacción mueve las dos jarras** (`jarId` origen + `toJarId` destino). Escribir dos
 * movimientos restaría de ambas y el dinero se evaporaría, porque el balance se DERIVA del libro.
 */
import { Transaction } from '../entities/Transaction';

export interface IJarActions {
  transfer(sourceJarId: string, destinationJarId: string, amount: number): Promise<Transaction>;
}
