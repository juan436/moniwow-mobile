export type TransactionType = 'gasto' | 'ingreso' | 'transferencia';

// Línea de un recibo (desglose del ticket). Opcional: la mayoría de movimientos no lo tiene.
// `amount` es opcional: en Quick Add el usuario teclea QUÉ compró, no a cuánto. El precio por ítem
// llega con el escaneo de la factura (M09). Un 0 aquí sería mentir — mejor "no lo sabemos".
export interface TransactionItem {
  id: string;
  name: string;
  amount?: number;
}

// Jarra de dinero no asignado. Un gasto que sale de aquí es, por definición, un gasto hormiga.
const LIBRE_JAR_ID = 'libre';

export interface TransactionProps {
  id: string;
  amount: number;
  jarId: string;
  type: TransactionType;
  description: string;
  date: Date;
  workspaceId: string;
  userId: string;
  // Jarra destino. Solo en type='transferencia': jarId = origen, toJarId = destino.
  toJarId?: string;
  // Deuda que este gasto amortiza. Es un ENLACE, no un dato duplicado: gracias a él se puede
  // preguntarle al libro qué cuotas están pagadas en vez de guardar un contador aparte.
  debtId?: string;
  // Qué CUOTA cubre este pago ('YYYY-MM'), que no es lo mismo que cuándo se pagó (`date`). Si en
  // agosto saldas la cuota atrasada de julio: date = agosto, cuotaMonth = '2026-07'. Con un solo
  // campo, julio se debería para siempre y agosto se daría por pagado sin serlo.
  cuotaMonth?: string;
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
  readonly toJarId?: string;
  readonly debtId?: string;
  readonly cuotaMonth?: string;
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
    this.toJarId = props.toJarId;
    this.debtId = props.debtId;
    this.cuotaMonth = props.cuotaMonth;
    this.items = props.items;
    this.receiptUri = props.receiptUri;
  }

  isTransfer(): boolean {
    return this.type === 'transferencia';
  }

  /**
   * Gasto hormiga: sale de dinero NO asignado. Es una regla derivada, no un campo — guardarlo
   * permitiría que contradijera a `jarId`, que ya lo dice. Decisión 2026-07-14.
   * Ojo: hormiga ≠ fuga. Esto dice de DÓNDE salió el dinero, no si el gasto valía la pena.
   */
  isHormiga(): boolean {
    return this.type === 'gasto' && this.jarId === LIBRE_JAR_ID;
  }
}
