/**
 * JsonGoalRepository — Adapter (mock)
 *
 * @what     Implementa IGoalRepository desde `db/goals.json`. Estado en memoria (mock-stage).
 */
import { Goal, GoalProps } from '@core/entities/Goal';
import { IGoalRepository } from '@core/ports/IGoalRepository';
import seed from '../db/goals.json';

const toGoal = (row: GoalProps): Goal => new Goal(row);

export class JsonGoalRepository implements IGoalRepository {
  private goals: Goal[] = (seed as unknown as GoalProps[]).map(toGoal);

  async findById(id: string): Promise<Goal | null> {
    return this.goals.find((g) => g.id === id) ?? null;
  }
  async findByWorkspace(workspaceId: string): Promise<Goal[]> {
    return this.goals.filter((g) => g.workspaceId === workspaceId);
  }
  async save(goal: Goal): Promise<void> {
    this.goals = [...this.goals, goal];
  }
  async update(goal: Goal): Promise<void> {
    this.goals = this.goals.map((g) => (g.id === goal.id ? goal : g));
  }
  async delete(id: string): Promise<void> {
    this.goals = this.goals.filter((g) => g.id !== id);
  }
}
