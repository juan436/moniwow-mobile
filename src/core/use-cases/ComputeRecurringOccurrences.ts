/**
 * ComputeRecurringOccurrences — Use Case
 *
 * @what     El estado de una regla recurrente, derivado del libro: qué ocurrencia toca este mes y
 *           cuáles se atrasaron. Espejo de `ComputeDebtStatus`, pero para reglas que pueden no tener
 *           fin (el sueldo no es una deuda de N cuotas).
 * @receives rec: Recurrence · txs: Transaction[] · today: Date
 * @processes La regla sabe qué meses le TOCAN (uno al mes desde `startMonth` hasta hoy, respetando
 *           `endMonth`). El libro sabe cuáles PAGASTE/confirmaste (tx con este `recurrenceId`,
 *           marcadas con el `recurrenceMonth` que cubren). Restar las dos da los atrasados. **Nada
 *           se guarda**: no hay un `status` que recalcular cada día y que mienta el día que nadie lo
 *           haga. `overdue` = meses ANTERIORES sin pagar (se acumulan, como las cuotas). `current` =
 *           el de este mes, si la regla ya empezó y sigue viva. El color (naranja gasto atrasado /
 *           verde ingreso por confirmar) lo decide la pantalla por el `type`, no este use-case.
 * @returns  RecurrenceStatus
 */
import { Recurrence } from '../entities/Recurrence';
import { Transaction } from '../entities/Transaction';
import { monthKey } from './ComputeMonthlyTotals';

export interface RecurrenceOccurrence {
  /** Mes que cubre la ocurrencia, 'YYYY-MM'. Es su identidad: la de julio es la de julio. */
  month: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
}

export interface RecurrenceStatus {
  /** Ocurrencias de meses anteriores, sin pagar. Las más viejas primero. */
  overdue: RecurrenceOccurrence[];
  /** La de este mes, si la regla ya empezó y sigue viva. */
  current: RecurrenceOccurrence | null;
}

export class ComputeRecurringOccurrences {
  execute(rec: Recurrence, txs: Transaction[], today: Date): RecurrenceStatus {
    const paidMonths = new Set(
      txs
        .filter((t) => t.recurrenceId === rec.id && t.recurrenceMonth !== undefined)
        .map((t) => t.recurrenceMonth as string),
    );

    const thisMonth = monthKey(today);
    const occurrences: RecurrenceOccurrence[] = [];

    for (const month of monthsFromTo(rec.startMonth, thisMonth)) {
      if (!rec.appliesIn(month)) continue;
      occurrences.push({
        month,
        dueDate: rec.dueDateFor(month),
        amount: rec.amount,
        isPaid: paidMonths.has(month),
      });
    }

    return {
      overdue: occurrences.filter((o) => !o.isPaid && o.month < thisMonth),
      current: occurrences.find((o) => o.month === thisMonth) ?? null,
    };
  }
}

/** Enumera meses 'YYYY-MM' de `start` a `end` inclusive. Si `start` > `end`, devuelve vacío. */
function monthsFromTo(start: string, end: string): string[] {
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end.split('-').map(Number);
  const months: string[] = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, '0')}`);
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  return months;
}
