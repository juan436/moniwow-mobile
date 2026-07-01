export type TransactionType = 'gasto' | 'ingreso' | 'transferencia';

export interface TransactionProps {
  id: string;
  amount: number;
  jarId: string;
  type: TransactionType;
  description: string;
  date: Date;
  workspaceId: string;
  userId: string;
  isHormiga: boolean;
}

export class Transaction {
  readonly id: string;
  readonly amount: number;
  readonly jarId: string;
  readonly type: TransactionType;
  readonly description: string;
  readonly date: Date;
  readonly workspaceId: string;
  readonly userId: string;
  readonly isHormiga: boolean;

  constructor(props: TransactionProps) {
    this.id = props.id;
    this.amount = props.amount;
    this.jarId = props.jarId;
    this.type = props.type;
    this.description = props.description;
    this.date = props.date;
    this.workspaceId = props.workspaceId;
    this.userId = props.userId;
    this.isHormiga = props.isHormiga;
  }
}
