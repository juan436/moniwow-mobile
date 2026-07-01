import { Goal } from '../entities/Goal';

export interface IGoalRepository {
  findById(id: string): Promise<Goal | null>;
  findByWorkspace(workspaceId: string): Promise<Goal[]>;
  save(goal: Goal): Promise<void>;
  update(goal: Goal): Promise<void>;
  delete(id: string): Promise<void>;
}
