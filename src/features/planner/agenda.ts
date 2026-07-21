/**
 * agenda — Planner Feature
 *
 * @what     Construye la Agenda: los compromisos de este mes + lo que está vencido.
 * @receives recurrences: RecurrenceWithStatus[] · debts: DebtWithStatus[] · jarOf · today
 * @processes **La unidad de deuda es la CUOTA, no la deuda.** El SERVIDOR cruza el calendario de cada
 *           deuda con el libro y devuelve la del mes y las atrasadas — que **se acumulan**: saltarte
 *           julio no borra julio. Acá ya no se calcula nada de eso: llega en `status`, y esta función
 *           solo decide en qué lista va cada cosa (que es presentación).
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
import { monthKey } from '@core/utils/monthKey';
import { toRecurrenceAgendaItem, toCuotaAgendaItem, hasPassed } from './mappers';
import { computeTotals } from './totals';
import type { DebtWithStatus } from '@core/types/DebtStatus';
import type { RecurrenceWithStatus } from '@core/types/RecurrenceStatus';
import type { JarPresentation } from '@shared/styles';
import type { AgendaData, AgendaItemDisplay } from './types';

export interface AgendaBundle {
  data: AgendaData;
  overdue: AgendaItemDisplay[];
  toConfirm: AgendaItemDisplay[];
}

export function buildAgenda(
  recurrences: RecurrenceWithStatus[],
  debts: DebtWithStatus[],
  jarOf: (jarId: string) => JarPresentation,
  today: Date,
): AgendaBundle {
  // Cada compromiso vive en UN sitio, y quién lo decide es el SERVIDOR: `status.current` es la
  // ocurrencia/cuota de este mes (→ Mi Mes) y `status.overdue` son los meses pasados sin pagar
  // (→ Atrasados). Acá NO se recalcula con la fecha: una cuota de julio con día ya vencido sigue
  // siendo la del mes, no un atrasado, y así la clasificó la API.
  const items: AgendaItemDisplay[] = [];
  const atrasadas: AgendaItemDisplay[] = [];
  const toConfirm: AgendaItemDisplay[] = [];

  // Un ingreso NO se atrasa (no lo debes): si pasó su día sin marcar, va a Por confirmar, no a
  // Atrasados. `hasPassed` aquí es presentación pura (un recordatorio), no clasifica el compromiso.
  const askIfIncome = (item: AgendaItemDisplay, isIncome: boolean, dueDate: Date) => {
    if (isIncome && !item.isPaid && hasPassed(dueDate, today)) toConfirm.push(item);
  };

  for (const { recurrence: rec, status } of recurrences) {
    const jar     = jarOf(rec.jarId);
    const isIncome = rec.type === 'ingreso';

    // Este mes → Mi Mes, tal cual lo marcó el servidor.
    if (status.current) {
      const item = toRecurrenceAgendaItem(rec, status.current, jar, false);
      items.push(item);
      askIfIncome(item, isIncome, status.current.dueDate);
    }
    // Meses pasados sin pagar: gasto → Atrasados; ingreso → Por confirmar (no lo debes).
    for (const occ of status.overdue) {
      const item = toRecurrenceAgendaItem(rec, occ, jar, !isIncome);
      if (isIncome) askIfIncome(item, true, occ.dueDate);
      else atrasadas.push(item);
    }
  }

  for (const { debt, status } of debts) {
    const jar    = jarOf(debt.sourceJarId);

    if (status.current) {
      items.push(toCuotaAgendaItem(debt, status.current, status.paidCount, jar, false));
    }
    for (const cuota of status.overdue) {
      atrasadas.push(toCuotaAgendaItem(debt, cuota, status.paidCount, jar, true));
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
