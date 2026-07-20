export type TransactionType = 'gasto' | 'ingreso' | 'transferencia';

// Línea de un recibo (desglose del ticket). Opcional: la mayoría de movimientos no lo tiene.
// `amount` es opcional: en Quick Add el usuario teclea QUÉ compró, no a cuánto. El precio por ítem
// llega con el escaneo de la factura (M09). Un 0 aquí sería mentir — mejor "no lo sabemos".
export interface TransactionItem {
  id: string;
  name: string;
  amount?: number;
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
  // Jarra destino. Solo en type='transferencia': jarId = origen, toJarId = destino.
  toJarId?: string;
  // Deuda que este gasto amortiza. Es un ENLACE, no un dato duplicado: gracias a él se puede
  // preguntarle al libro qué cuotas están pagadas en vez de guardar un contador aparte.
  debtId?: string;
  // Qué CUOTA cubre este pago ('YYYY-MM'), que no es lo mismo que cuándo se pagó (`date`). Si en
  // agosto saldas la cuota atrasada de julio: date = agosto, cuotaMonth = '2026-07'. Con un solo
  // campo, julio se debería para siempre y agosto se daría por pagado sin serlo.
  cuotaMonth?: string;
  // Regla recurrente que este movimiento salda. ENLACE (como debtId): permite preguntarle al libro
  // qué ocurrencias están pagadas en vez de guardar un `status` por mes.
  recurrenceId?: string;
  // Qué OCURRENCIA cubre ('YYYY-MM'), no cuándo se pagó (`date`). Confirmar la renta de julio en
  // agosto: date = agosto, recurrenceMonth = '2026-07'. Misma lógica que `cuotaMonth`.
  recurrenceMonth?: string;
  items?: TransactionItem[];
  receiptUri?: string;
  // Sale de dinero NO asignado (la jarra Libre). **Lo decide el servidor**: antes se derivaba acá
  // comparando `jarId === 'libre'`, y ese id solo existe en el workspace sembrado — con un usuario
  // nuevo, cuyas jarras llevan UUID, `isHormiga` habría dado `false` siempre y M04 se habría quedado
  // muerto sin un solo error en pantalla. La identidad de una jarra base es su `type`, y el `type` lo
  // sabe quien tiene la jarra delante.
  isHormiga: boolean;
  isTransfer: boolean;
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
  readonly recurrenceId?: string;
  readonly recurrenceMonth?: string;
  readonly items?: TransactionItem[];
  readonly receiptUri?: string;
  readonly isHormiga: boolean;
  readonly isTransfer: boolean;

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
    this.recurrenceId = props.recurrenceId;
    this.recurrenceMonth = props.recurrenceMonth;
    this.items = props.items;
    this.receiptUri = props.receiptUri;
    this.isHormiga = props.isHormiga;
    this.isTransfer = props.isTransfer;
  }
}
