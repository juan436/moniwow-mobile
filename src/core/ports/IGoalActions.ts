/**
 * IGoalActions — Port (acción)
 *
 * @what     Sacar dinero de una meta (Slider de Sacrificio, M08). Es una ACCIÓN, no un `update()`.
 * @receives goalId · amount
 * @processes Lo implementa `HttpGoalActions` contra `POST /goals/:id/withdraw`.
 * @returns  Promise<WithdrawResult> — la meta con su `currentAmount` ya bajado **y** el movimiento
 *           escrito (Metas → Libre), para meterlo al libro local.
 *
 * Mismo motivo que [[IDebtActions]]: sacar de una meta mueve dinero de verdad y baja un dato guardado
 * de la meta a la vez — es una regla, no dos escrituras de fila que el cliente arme por su cuenta. El
 * `id` del movimiento y la fecha los pone el servidor; `workspaceId`/`userId` salen del token.
 */
import { Goal } from '../entities/Goal';
import { Transaction } from '../entities/Transaction';

export interface WithdrawResult {
  goal: Goal;
  transaction: Transaction;
}

export interface IGoalActions {
  withdraw(goalId: string, amount: number): Promise<WithdrawResult>;
}
