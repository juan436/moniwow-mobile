/**
 * HttpGoalActions — Adapter (HTTP)
 *
 * @what     Implementa IGoalActions contra `POST /goals/:id/withdraw`.
 * @receives goalId · amount
 * @processes Manda SOLO el monto. El id del movimiento, la fecha y las jarras (Metas → Libre) los pone
 *           el servidor. La respuesta trae la meta ya actualizada y el movimiento; se reusan los mismos
 *           mappers que `GET /goals` y `GET /transactions`.
 * @returns  Promise<WithdrawResult> — { goal, transaction }.
 */
import type { IGoalActions, WithdrawResult } from '@core/ports/IGoalActions';

import { toGoal, type GoalDto } from './HttpGoalRepository';
import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

interface WithdrawDto {
  goal: GoalDto;
  transaction: TransactionDto;
}

export class HttpGoalActions implements IGoalActions {
  async withdraw(goalId: string, amount: number): Promise<WithdrawResult> {
    const dto = await request<WithdrawDto>(`/goals/${goalId}/withdraw`, {
      method: 'POST',
      body: { amount },
    });
    return { goal: toGoal(dto.goal), transaction: toTransaction(dto.transaction) };
  }
}
