/**
 * IDebtActions — Port (acción)
 *
 * @what     Pagar una cuota. Es una ACCIÓN, no una escritura de fila.
 * @receives debtId · cuotaMonth ('YYYY-MM': QUÉ cuota se salda, no cuándo se paga)
 * @processes Lo implementa `HttpDebtActions` contra `POST /debts/:id/pay-cuota`.
 * @returns  Promise<Transaction> — el movimiento que quedó escrito en el libro.
 *
 * **Por qué existe este port y no basta `IDebtRepository.save()`** (decisión B, 2026-07-19):
 * pagar una cuota no es guardar un objeto, es una regla — de qué jarra sale, cuánto, si esa cuota ya
 * estaba pagada. Con un repo HTTP, el `save(tx)` de un use-case en mobile se volvería
 * `POST /transactions` con la transacción ya calculada, y el endpoint que tiene la regla **no lo
 * llamaría nadie**. Dos verdades compitiendo, y la del servidor perdiendo siempre.
 *
 * **El monto no viaja**: sale de `debt.cuotaAmount()` del lado servidor. Si el cliente pudiera
 * mandarlo, pagaría una cuota de $1000 con $1. `workspaceId` y `userId` salen del token.
 *
 * **`cancel` también es acción, no `update()`**: dónde corta (última cuota vencida) es una regla que
 * vive en el servidor. Devuelve la deuda con su estado ya recalculado para reemplazar la fila local.
 */
import { Transaction } from '../entities/Transaction';
import type { DebtWithStatus } from '../types/DebtStatus';

export interface IDebtActions {
  payCuota(debtId: string, cuotaMonth: string): Promise<Transaction>;
  cancel(debtId: string): Promise<DebtWithStatus>;
}
