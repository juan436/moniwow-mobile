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
import { Goal } from '@core/entities/Goal';
import type {
  CreateGoalInput,
  IGoalActions,
  UpdateGoalInput,
  WithdrawResult,
} from '@core/ports/IGoalActions';

import { toGoal, type GoalDto } from './HttpGoalRepository';
import { request } from './httpClient';
import { toTransaction, type TransactionDto } from './transactionDto';

interface WithdrawDto {
  goal: GoalDto;
  transaction: TransactionDto;
}

export class HttpGoalActions implements IGoalActions {
  /** Crea una meta. El id lo pone el servidor; devuelve la meta ya con su id real. */
  async create(input: CreateGoalInput): Promise<Goal> {
    const dto = await request<GoalDto>('/goals', { method: 'POST', body: input });
    return toGoal(dto);
  }

  /** Edita nombre/icono/objetivo. Lo asignado no se toca; devuelve la meta actualizada. */
  async update(goalId: string, input: UpdateGoalInput): Promise<Goal> {
    const dto = await request<GoalDto>(`/goals/${goalId}`, { method: 'PATCH', body: input });
    return toGoal(dto);
  }

  /** Borra una meta. */
  async remove(goalId: string): Promise<void> {
    await request<void>(`/goals/${goalId}`, { method: 'DELETE' });
  }

  /** Aportar: sube el saldo asignado de la meta (reasigna del pozo). Devuelve la meta. */
  async deposit(goalId: string, amount: number): Promise<Goal> {
    const dto = await request<GoalDto>(`/goals/${goalId}/deposit`, { method: 'POST', body: { amount } });
    return toGoal(dto);
  }

  async withdraw(goalId: string, amount: number): Promise<WithdrawResult> {
    const dto = await request<WithdrawDto>(`/goals/${goalId}/withdraw`, {
      method: 'POST',
      body: { amount },
    });
    return { goal: toGoal(dto.goal), transaction: toTransaction(dto.transaction) };
  }
}
