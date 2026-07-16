export type RecurrenceType = 'ingreso' | 'gasto';

/**
 * Una regla recurrente (ingreso o gasto que se repite cada mes). **No guarda qué meses pagaste ni
 * cuál toca**: eso lo deriva `ComputeRecurringOccurrences` cruzando esta regla con el libro (tx con
 * `recurrenceId` + `recurrenceMonth`). Mismo modelo que `Debt`: la regla se guarda una vez, las
 * ocurrencias se derivan — un `pendingItem` por mes era guardar el dato derivado.
 *
 * `endMonth` opcional: ausente = indefinida (sueldo, renta); presente = termina ese mes (contrato /
 * suscripción de N meses — el wizard lo ofrece como "Duración"). Una deuda NO es un recurrente: es
 * `Debt` (siempre finita, con cuotas y acreedor).
 */
export interface RecurrenceProps {
  id: string;
  name: string;
  amount: number;
  type: RecurrenceType;
  /** Día del mes en que cae (1–28). */
  dayOfMonth: number;
  /** Jarra de la que SALE (gasto) o a la que ENTRA (ingreso). */
  jarId: string;
  /** Primer mes que aplica, 'YYYY-MM'. */
  startMonth: string;
  /** Último mes inclusive, 'YYYY-MM'. Ausente = indefinida. */
  endMonth?: string;
  workspaceId: string;
}

export class Recurrence {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
  readonly type: RecurrenceType;
  readonly dayOfMonth: number;
  readonly jarId: string;
  readonly startMonth: string;
  readonly endMonth?: string;
  readonly workspaceId: string;

  constructor(props: RecurrenceProps) {
    this.id = props.id;
    this.name = props.name;
    this.amount = props.amount;
    this.type = props.type;
    this.dayOfMonth = props.dayOfMonth;
    this.jarId = props.jarId;
    this.startMonth = props.startMonth;
    this.endMonth = props.endMonth;
    this.workspaceId = props.workspaceId;
  }

  /** Fecha de vencimiento en un mes dado ('YYYY-MM'). */
  dueDateFor(month: string): Date {
    const [year, m] = month.split('-').map(Number);
    return new Date(year, m - 1, this.dayOfMonth);
  }

  /** ¿La regla aplica en este mes? Dentro de [startMonth, endMonth]. Compara 'YYYY-MM' como texto. */
  appliesIn(month: string): boolean {
    if (month < this.startMonth) return false;
    if (this.endMonth !== undefined && month > this.endMonth) return false;
    return true;
  }
}
