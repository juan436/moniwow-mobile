import { Goal } from '../entities/Goal';
import { Jar, JarType } from '../entities/Jar';
import { IJarRepository } from '../ports/IJarRepository';
import { IGoalRepository } from '../ports/IGoalRepository';

export interface WithdrawFromGoalInput {
  goalId: string;
  amount: number;
  workspaceId: string;
}

export interface WithdrawFromGoalResult {
  goal: Goal;
  libreJar: Jar;
  starsLost: number;
}

export class WithdrawFromGoal {
  constructor(
    private readonly goalRepo: IGoalRepository,
    private readonly jarRepo: IJarRepository,
  ) {}

  async execute(input: WithdrawFromGoalInput): Promise<WithdrawFromGoalResult> {
    const goal = await this.goalRepo.findById(input.goalId);
    if (!goal) throw new Error(`Goal ${input.goalId} not found`);
    if (!goal.canWithdraw(input.amount)) {
      throw new Error('Insufficient funds in goal');
    }

    const jars = await this.jarRepo.findByWorkspace(input.workspaceId);
    const libreJar = jars.find((j) => j.type === ('libre' as JarType)) ?? null;
    if (!libreJar) throw new Error('Libre jar not found');

    const starsBefore = goal.stars();
    goal.currentAmount -= input.amount;
    const starsAfter = goal.stars();

    libreJar.balance += input.amount;

    await this.goalRepo.update(goal);
    await this.jarRepo.update(libreJar);

    return { goal, libreJar, starsLost: starsBefore - starsAfter };
  }
}
