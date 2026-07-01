/**
 * CreateGoal — UseCase
 *
 * @what     Crea una nueva meta de ahorro con currentAmount=0 y la persiste.
 * @receives CreateGoalInput: name, icon, targetAmount, workspaceId, targetDate?
 * @processes Valida targetAmount > 0. Genera id único. Instancia Goal. Llama goalRepo.save().
 * @returns  Promise<Goal> — entidad creada
 */
import { Goal } from '../entities/Goal';
import { IGoalRepository } from '../ports/IGoalRepository';

export interface CreateGoalInput {
  name: string;
  icon: string;
  targetAmount: number;
  workspaceId: string;
  targetDate?: Date;
}

export class CreateGoal {
  constructor(private readonly goalRepo: IGoalRepository) {}

  async execute(input: CreateGoalInput): Promise<Goal> {
    if (input.targetAmount <= 0) throw new Error('Target amount must be positive');
    const goal = new Goal({
      id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name: input.name.trim(),
      icon: input.icon,
      targetAmount: input.targetAmount,
      currentAmount: 0,
      workspaceId: input.workspaceId,
      targetDate: input.targetDate,
    });
    await this.goalRepo.save(goal);
    return goal;
  }
}
