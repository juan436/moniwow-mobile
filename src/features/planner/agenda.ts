/**
 * agenda — Planner Feature
 *
 * @what     Construye la Agenda: los compromisos de este mes + lo que está vencido.
 * @receives recurrences: Recurrence[] · debts: Debt[] · txs: Transaction[] · jarOf · today
 * @processes **La unidad de deuda es la CUOTA, no la deuda.** `ComputeDebtStatus` cruza el calendario
 *           de cada deuda con el libro y devuelve la del mes y las atrasadas — que **se acumulan**:
 *           saltarte julio no borra julio.
 *           **Cada compromiso vive en UN sitio.** Si venció, en `overdue` (Atrasados); si no, en Mi
 *           Mes. Antes un gasto vencido salía en los dos y pagarlo en uno lo borraba del otro:
 *           parecía un bug. Por eso el hero "te falta pagar este mes" ya no cuenta lo vencido — eso
 *           tiene su propio total en Atrasados.
 *           **`overdue` solo lleva pagos y cuotas.** Los ingresos no se atrasan: un sueldo que no
 *           llegó no es algo que debas.
 *           `toConfirm` = ingresos cuya fecha ya pasó y siguen sin marcar. **No es un atrasado** (no
 *           lo debes): es un recordatorio de que quizá se te olvidó confirmar que llegó. Estos SÍ
 *           siguen en Mi Mes (son parte del mes, no un problema): Por confirmar es solo un atajo.
 *           Extraído de `usePlanner` (se pasaba de 150 líneas).
 * @returns  { data, overdue, toConfirm }
 */
import { ComputeDebtStatus } from '@core/use-cases/ComputeDebtStatus';
import { ComputeRecurringOccurrences } from '@core/use-cases/ComputeRecurringOccurrences';
import { monthKey } from '@core/use-cases/ComputeMonthlyTotals';
import { toRecurrenceAgendaItem, toCuotaAgendaItem, hasPassed } from './mappers';
import { computeTotals } from './totals';
import type { Debt } from '@core/entities/Debt';
import type { Recurrence } from '@core/entities/Recurrence';
import type { Transaction } from '@core/entities/Transaction';
import type { JarPresentation } from '@shared/styles';
import type { AgendaData, AgendaItemDisplay } from './types';

const computeDebtStatus = new ComputeDebtStatus();
const computeRecurring = new ComputeRecurringOccurrences();

export interface AgendaBundle {
  data: AgendaData;
  overdue: AgendaItemDisplay[];
  toConfirm: AgendaItemDisplay[];
}

export function buildAgenda(
  recurrences: Recurrence[],
  debts: Debt[],
  txs: Transaction[],
  jarOf: (jarId: string) => JarPresentation,
  today: Date,
): AgendaBundle {
  // Cada compromiso vive en UN sitio: si venció, en Atrasados; si no, en Mi Mes. Antes un gasto
  // vencido salía en los dos y pagarlo en uno lo borraba del otro — parecía un bug.
  const items: AgendaItemDisplay[] = [];
  const atrasadas: AgendaItemDisplay[] = [];
  const toConfirm: AgendaItemDisplay[] = [];
  const place = (item: AgendaItemDisplay) => (item.isOverdue ? atrasadas : items).push(item);

  // Un ingreso NO se atrasa (no lo debes): si pasó su día sin marcar, va a Por confirmar, no a
  // Atrasados. `isOverdue` ya viene apagado para ingresos desde el mapper.
  const askIfIncome = (item: AgendaItemDisplay, isIncome: boolean, dueDate: Date) => {
    if (isIncome && !item.isPaid && hasPassed(dueDate, today)) toConfirm.push(item);
  };

  for (const rec of recurrences) {
    const status  = computeRecurring.execute(rec, txs, today);
    const jar     = jarOf(rec.jarId);
    const isIncome = rec.type === 'ingreso';

    if (status.current) {
      const item = toRecurrenceAgendaItem(rec, status.current, jar, today);
      place(item);
      askIfIncome(item, isIncome, status.current.dueDate);
    }
    for (const occ of status.overdue) {
      const item = toRecurrenceAgendaItem(rec, occ, jar, today);
      if (item.isOverdue) atrasadas.push(item);   // gasto atrasado
      else askIfIncome(item, isIncome, occ.dueDate); // ingreso de mes pasado sin confirmar
    }
  }

  for (const debt of debts) {
    const status = computeDebtStatus.execute(debt, txs, today);
    const jar    = jarOf(debt.sourceJarId);

    if (status.current) place(toCuotaAgendaItem(debt, status.current, status.paidCount, jar, today));
    for (const cuota of status.overdue) {
      atrasadas.push(toCuotaAgendaItem(debt, cuota, status.paidCount, jar, today));
    }
  }

  // Lo más viejo primero. Una ocurrencia/cuota de este mes cae al final (usa el mes actual).
  const thisMonth = monthKey(today);
  const when = (i: AgendaItemDisplay) =>
    `${i.cuotaMonth ?? i.recurrenceMonth ?? thisMonth}-${String(i.day).padStart(2, '0')}`;

  return {
    data: { items, totals: computeTotals(items) },
    overdue: atrasadas.sort((a, b) => when(a).localeCompare(when(b))),
    toConfirm: toConfirm.sort((a, b) => a.day - b.day),
  };
}
