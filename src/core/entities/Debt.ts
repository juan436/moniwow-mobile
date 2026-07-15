export type DebtOrigin = 'jarra_negativa' | 'cuotas' | 'tercero';

/**
 * Una deuda. **No guarda cuántas cuotas llevas pagadas**: eso lo sabe el libro (los gastos con
 * `debtId`). Un contador `paidCuotas` decía "llevas 7" pero no cuáles — y sin saber CUÁLES, no se
 * puede saber si te saltaste mayo. Lo que se puede contar, se cuenta; no se guarda.
 *
 * `sourceJarId` es OBLIGATORIO: el wizard siempre pregunta de qué jarra se paga (último paso). Era
 * opcional con un `?? 'libre'` por detrás, así que las deudas sembradas sin jarra pagaban de Libre
 * sin que nadie lo hubiera decidido.
 */
export interface DebtProps {
  id: string;
  description: string;
  amount: number;
  /** Día del mes en que vence cada cuota (1–28). La cuota k vence en el mes `createdAt + (k−1)`. */
  dueDay: number;
  cuotas: number;
  sourceJarId: string;
  workspaceId: string;
  createdAt: Date;
  origin: DebtOrigin;
}

export class Debt {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly dueDay: number;
  readonly cuotas: number;
  readonly sourceJarId: string;
  readonly workspaceId: string;
  readonly createdAt: Date;
  readonly origin: DebtOrigin;

  constructor(props: DebtProps) {
    this.id = props.id;
    this.description = props.description;
    this.amount = props.amount;
    this.dueDay = props.dueDay;
    this.cuotas = props.cuotas;
    this.sourceJarId = props.sourceJarId;
    this.workspaceId = props.workspaceId;
    this.createdAt = props.createdAt;
    this.origin = props.origin;
  }

  cuotaAmount(): number {
    return this.cuotas > 0 ? this.amount / this.cuotas : this.amount;
  }

  /** Fecha de vencimiento de la cuota n (1-based). Una cuota por mes desde que se creó la deuda. */
  cuotaDueDate(n: number): Date {
    return new Date(this.createdAt.getFullYear(), this.createdAt.getMonth() + (n - 1), this.dueDay);
  }

  /** Cuántas cuotas llevas y cuánto debes son preguntas para el LIBRO: recibe la cuenta. */
  isPaid(paidCount: number): boolean {
    return paidCount >= this.cuotas;
  }

  remainingAmount(paidCount: number): number {
    return this.amount - this.cuotaAmount() * paidCount;
  }
}
