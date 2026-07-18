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
  /** Día del mes en que cae (1–31). El 31 vale como "el último": ningún mes tiene más. */
  dayOfMonth: number;
  /** Jarra de la que SALE (gasto) o a la que ENTRA (ingreso). */
  jarId: string;
  /** Primer mes que aplica, 'YYYY-MM'. */
  startMonth: string;
  /** Último mes inclusive, 'YYYY-MM'. Ausente = indefinida. */
  endMonth?: string;
  /**
   * Mes en que se CANCELÓ ('YYYY-MM'). Ausente = no cancelada. Separado de `endMonth` a propósito:
   * `endMonth` no distingue "cancelada" de "termina por diseño" (una regla de 12 meses tiene
   * `endMonth` y sigue viva). Presente = sale de "Compromisos activos" YA, aunque `endMonth` sea
   * este mes. Lo que aún se deba sigue en Mi Mes/Atrasados vía `endMonth` — este campo no lo toca.
   */
  cancelledAt?: string;
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
  readonly cancelledAt?: string;
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
    this.cancelledAt = props.cancelledAt;
    this.workspaceId = props.workspaceId;
  }

  /**
   * Fecha de vencimiento en un mes dado ('YYYY-MM'). El día se resuelve AQUÍ, no al guardar: recién
   * acá se sabe de qué mes se habla. Si el mes no llega al día guardado, cae en el último real —
   * 31 en febrero → 28 (29 en bisiesto), 31 en abril → 30. Por eso el 31 expresa "el último día del
   * mes" sin valor especial. Guardar el día ya recortado a 28 volvía "el último" imposible.
   */
  dueDateFor(month: string): Date {
    const [year, m] = month.split('-').map(Number);
    const lastDay = new Date(year, m, 0).getDate();
    return new Date(year, m - 1, Math.min(this.dayOfMonth, lastDay));
  }

  /** ¿La regla aplica en este mes? Dentro de [startMonth, endMonth]. Compara 'YYYY-MM' como texto. */
  appliesIn(month: string): boolean {
    if (month < this.startMonth) return false;
    if (this.endMonth !== undefined && month > this.endMonth) return false;
    return true;
  }
}
