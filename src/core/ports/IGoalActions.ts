/**
 * IGoalActions — Port (acción)
 *
 * @what     Escrituras de meta server-authoritative: CRUD (crear/editar/borrar), Aportar y el Slider
 *           de Sacrificio (sacar).
 * @receives Según el método.
 * @processes Lo implementa `HttpGoalActions` contra `POST/PATCH/DELETE /goals` + `/deposit` + `/withdraw`.
 * @returns  Goal (create/update/deposit) · void (remove) · WithdrawResult (withdraw).
 *
 * **Por qué no `IGoalRepository`:** el id lo pone el servidor (mobile no genera UUID); `withdraw` mueve
 * dinero de verdad (Metas → Libre) además de bajar el saldo asignado; `deposit` reasigna dentro del
 * pozo. Son reglas, no escrituras de fila que el cliente arme. `create`/`update`/`deposit` devuelven la
 * meta con su estado del servidor; `withdraw` además el movimiento, para el libro local.
 */
import { Goal } from '../entities/Goal';
import { Transaction } from '../entities/Transaction';

export interface WithdrawResult {
  goal: Goal;
  transaction: Transaction;
}

export interface CreateGoalInput {
  name: string;
  icon: string;
  targetAmount: number;
}

export interface UpdateGoalInput {
  name?: string;
  icon?: string;
  targetAmount?: number;
}

export interface IGoalActions {
  create(input: CreateGoalInput): Promise<Goal>;
  update(goalId: string, input: UpdateGoalInput): Promise<Goal>;
  remove(goalId: string): Promise<void>;
  deposit(goalId: string, amount: number): Promise<Goal>;
  withdraw(goalId: string, amount: number): Promise<WithdrawResult>;
}
