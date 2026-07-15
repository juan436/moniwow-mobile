/**
 * agenda — Planner Feature
 *
 * @what     Construye la Agenda: los compromisos de este mes + lo que está vencido.
 * @receives pending: PendingItem[] · debts: Debt[] · txs: Transaction[] · presById · today
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
import { monthKey } from '@core/use-cases/ComputeMonthlyTotals';
import { toAgendaItem, toCuotaAgendaItem, hasPassed } from './mappers';
import { computeTotals } from './totals';
import type { Debt } from '@core/entities/Debt';
import type { Transaction } from '@core/entities/Transaction';
import type { PendingItem } from '@core/ports/IAgendaRepository';
import type { JarPresentation } from '@shared/styles';
import type { AgendaData, AgendaItemDisplay } from './types';

const computeDebtStatus = new ComputeDebtStatus();

export interface AgendaBundle {
  data: AgendaData;
  overdue: AgendaItemDisplay[];
  toConfirm: AgendaItemDisplay[];
}

export function buildAgenda(
  pending: PendingItem[],
  debts: Debt[],
  txs: Transaction[],
  jarOf: (jarId: string) => JarPresentation,
  today: Date,
): AgendaBundle {
  // Cada compromiso vive en UN sitio: si venció, en Atrasados; si no, en Mi Mes. Antes un gasto
  // vencido salía en los dos y pagarlo en uno lo borraba del otro — parecía un bug.
  const items: AgendaItemDisplay[] = [];
  const atrasadas: AgendaItemDisplay[] = [];
  const place = (item: AgendaItemDisplay) => (item.isOverdue ? atrasadas : items).push(item);

  for (const i of pending) {
    place(toAgendaItem(i, jarOf(i.jarId), today));
  }

  for (const debt of debts) {
    const status = computeDebtStatus.execute(debt, txs, today);
    const jar    = jarOf(debt.sourceJarId);

    if (status.current) place(toCuotaAgendaItem(debt, status.current, status.paidCount, jar, today));
    for (const cuota of status.overdue) {
      atrasadas.push(toCuotaAgendaItem(debt, cuota, status.paidCount, jar, today));
    }
  }

  // Lo más viejo primero. Un pago no tiene `cuotaMonth`: es de este mes, así que cae al final.
  const thisMonth = monthKey(today);
  const when = (i: AgendaItemDisplay) => `${i.cuotaMonth ?? thisMonth}-${String(i.day).padStart(2, '0')}`;

  // Ingresos cuya fecha ya pasó y siguen sin marcar: ¿se te olvidó confirmar que llegó?
  const toConfirm = pending
    .filter((i) => i.type === 'ingreso' && i.status !== 'confirmado' && hasPassed(i.dueDate, today))
    .map((i) => toAgendaItem(i, jarOf(i.jarId), today))
    .sort((a, b) => a.day - b.day);

  return {
    data: { items, totals: computeTotals(items) },
    overdue: atrasadas.sort((a, b) => when(a).localeCompare(when(b))),
    toConfirm,
  };
}
