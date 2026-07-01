/**
 * DeleteGoal — UseCase
 *
 * @what     Elimina una meta de ahorro del repositorio.
 * @receives id: string — identificador de la meta
 * @processes Verifica existencia. Lanza Error si no existe. Llama goalRepo.delete().
 * @returns  Promise<void>
 */
import { IGoalRepository } from '../ports/IGoalRepository';

export class DeleteGoal {
  constructor(private readonly goalRepo: IGoalRepository) {}

  async execute(id: string): Promise<void> {
    const goal = await this.goalRepo.findById(id);
    if (!goal) throw new Error(`Goal ${id} not found`);
    await this.goalRepo.delete(id);
  }
}
