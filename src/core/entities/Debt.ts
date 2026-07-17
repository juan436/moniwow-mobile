export type DebtOrigin = 'jarra_negativa' | 'cuotas' | 'tercero';

/**
 * Una deuda. **Lo que pagaste desde que la registraste lo sabe el libro** (los gastos con
 * `debtId`), no un contador acá. Un `paidCuotas` decía "llevas 7" pero no cuáles — y sin saber
 * CUÁLES, no se puede saber si te saltaste mayo. Lo que se puede contar, se cuenta.
 *
 * `cuotas` ausente = **único pago**: el total, de una, el día `dueDay`. Es el caso corriente
 * ("le debo $400 y se los doy el 15"). Con `cuotas` = deuda a plazos.
 *
 * `cuotasPagadas` NO es el `paidCuotas` difunto: es cuántas llevabas **antes** de registrar la
 * deuda acá — historia previa que el libro no puede saber porque ocurrió antes de que existiera.
 * Es inmutable; de la registración en adelante manda el libro.
 *
 * `sourceJarId` es OBLIGATORIO: el wizard siempre pregunta de qué jarra se paga (último paso). Era
 * opcional con un `?? 'libre'` por detrás, así que las deudas sembradas sin jarra pagaban de Libre
 * sin que nadie lo hubiera decidido.
 */
export interface DebtProps {
  id: string;
  description: string;
  amount: number;
  /** Día del mes en que vence cada cuota (1–31). La cuota k vence en el mes `createdAt + (k−1)`. */
  dueDay: number;
  /** Nº de cuotas. Ausente o 0 = único pago del total. */
  cuotas?: number;
  /** Cuotas pagadas ANTES de registrar la deuda acá. Ausente o 0 = ninguna. No muta. */
  cuotasPagadas?: number;
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
  readonly cuotas?: number;
  readonly cuotasPagadas?: number;
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
    this.cuotasPagadas = props.cuotasPagadas;
    this.sourceJarId = props.sourceJarId;
    this.workspaceId = props.workspaceId;
    this.createdAt = props.createdAt;
    this.origin = props.origin;
  }

  /**
   * Cuántos pagos tiene la deuda. **Único lugar que traduce "sin cuotas" → 1**: sin esto,
   * `isPaid(0)` haría `0 >= 0` y la deuda nacería saldada, desapareciendo apenas se crea.
   */
  totalCuotas(): number {
    return this.cuotas !== undefined && this.cuotas > 0 ? this.cuotas : 1;
  }

  /** Cuotas que ya venían pagadas al registrar la deuda. Historia previa, no la cuenta el libro. */
  initialPaid(): number {
    return this.cuotasPagadas ?? 0;
  }

  cuotaAmount(): number {
    return this.amount / this.totalCuotas();
  }

  /**
   * Fecha de vencimiento de la cuota n (1-based). Una cuota por mes desde que se creó la deuda.
   * El día se clampea al último real de ESE mes: una cuota con `dueDay` 31 cae 28 en febrero. Sin
   * eso `new Date(2026, 1, 31)` se desborda al 3 de marzo y la cuota se va de mes.
   */
  cuotaDueDate(n: number): Date {
    const year    = this.createdAt.getFullYear();
    const month   = this.createdAt.getMonth() + (n - 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(this.dueDay, lastDay));
  }

  /** Cuántas cuotas llevas y cuánto debes son preguntas para el LIBRO: recibe la cuenta. */
  isPaid(paidCount: number): boolean {
    return paidCount >= this.totalCuotas();
  }

  remainingAmount(paidCount: number): number {
    return this.amount - this.cuotaAmount() * paidCount;
  }
}
