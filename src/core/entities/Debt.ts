export type DebtOrigin = 'jarra_negativa' | 'cuotas' | 'tercero';

export interface DebtProps {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  cuotas: number;
  paidCuotas: number;
  workspaceId: string;
  createdAt: Date;
  origin: DebtOrigin;
  sourceJarId?: string;
}

export class Debt {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly dueDate: Date;
  readonly cuotas: number;
  paidCuotas: number;
  readonly workspaceId: string;
  readonly createdAt: Date;
  readonly origin: DebtOrigin;
  readonly sourceJarId?: string;

  constructor(props: DebtProps) {
    this.id = props.id;
    this.description = props.description;
    this.amount = props.amount;
    this.dueDate = props.dueDate;
    this.cuotas = props.cuotas;
    this.paidCuotas = props.paidCuotas;
    this.workspaceId = props.workspaceId;
    this.createdAt = props.createdAt;
    this.origin = props.origin;
    this.sourceJarId = props.sourceJarId;
  }

  isOverdue(): boolean {
    return new Date() > this.dueDate && !this.isPaid();
  }

  isPaid(): boolean {
    return this.paidCuotas >= this.cuotas;
  }

  cuotaAmount(): number {
    return this.cuotas > 0 ? this.amount / this.cuotas : this.amount;
  }

  remainingAmount(): number {
    return this.amount - this.cuotaAmount() * this.paidCuotas;
  }
}
