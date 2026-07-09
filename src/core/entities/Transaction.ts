export type TransactionType = 'gasto' | 'ingreso' | 'transferencia';

// Línea de un recibo (desglose del ticket). Opcional: la mayoría de movimientos no lo tiene.
export interface TransactionItem {
  id: string;
  name: string;
  amount: number;
}

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
  // Jarra destino. Solo en type='transferencia': jarId = origen, toJarId = destino.
  toJarId?: string;
  items?: TransactionItem[];
  receiptUri?: string;
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
  readonly toJarId?: string;
  readonly items?: TransactionItem[];
  readonly receiptUri?: string;

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
    this.toJarId = props.toJarId;
    this.items = props.items;
    this.receiptUri = props.receiptUri;
  }

  isTransfer(): boolean {
    return this.type === 'transferencia';
  }
}
