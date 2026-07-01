export interface GoalProps {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  workspaceId: string;
  targetDate?: Date;
}

export class Goal {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly targetAmount: number;
  currentAmount: number;
  readonly workspaceId: string;
  readonly targetDate?: Date;

  constructor(props: GoalProps) {
    this.id = props.id;
    this.name = props.name;
    this.icon = props.icon;
    this.targetAmount = props.targetAmount;
    this.currentAmount = props.currentAmount;
    this.workspaceId = props.workspaceId;
    this.targetDate = props.targetDate;
  }

  progressPercent(): number {
    if (this.targetAmount === 0) return 0;
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
  }

  // 1 estrella por cada 20% de progreso (0–5)
  stars(): number {
    return Math.floor(this.progressPercent() / 20);
  }

  canWithdraw(amount: number): boolean {
    return this.currentAmount >= amount;
  }
}
