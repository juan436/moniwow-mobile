/**
 * UpdateGoal — UseCase
 *
 * @what     Actualiza nombre, icono y monto objetivo de una meta existente.
 * @receives UpdateGoalInput: id, name, icon, targetAmount
 * @processes Valida targetAmount > 0. Busca meta. Crea nueva instancia Goal con currentAmount preservado. Persiste.
 * @returns  Promise<Goal> — entidad actualizada
 */
import { Goal } from '../entities/Goal';
import { IGoalRepository } from '../ports/IGoalRepository';

export interface UpdateGoalInput {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
}

export class UpdateGoal {
  constructor(private readonly goalRepo: IGoalRepository) {}

  async execute(input: UpdateGoalInput): Promise<Goal> {
    if (input.targetAmount <= 0) throw new Error('Target amount must be positive');
    const existing = await this.goalRepo.findById(input.id);
    if (!existing) throw new Error(`Goal ${input.id} not found`);
    const updated = new Goal({
      id: existing.id,
      name: input.name.trim(),
      icon: input.icon,
      targetAmount: input.targetAmount,
      currentAmount: existing.currentAmount,
      workspaceId: existing.workspaceId,
      targetDate: existing.targetDate,
    });
    await this.goalRepo.update(updated);
    return updated;
  }
}
