/**
 * mappers — Planner Feature
 *
 * @what     Deriva los compromisos de la Agenda desde el dominio. La Agenda no tiene datos propios.
 * @receives rec: Recurrence + occ · debt: Debt + cuota · jar: JarPresentation (la jarra dueña) · today: Date
 * @processes Ícono y color salen de la JARRA, no de un emoji guardado aparte.
 *           **Nada se guarda como "compromiso"**: una deuda con cuotas pendientes (C2) y una regla
 *           recurrente YA son compromisos mensuales — su cuota/ocurrencia en su `dueDate`. Guardar
 *           también la fila era duplicar la colección.
 *           `isOverdue` se deriva de la fecha, no se guarda: un `status: 'atrasado'` en la BD habría
 *           que recalcularlo cada día, y el día que nadie lo haga, la app miente. **Solo pagos y
 *           cuotas se atrasan** — un ingreso que no llegó no es una deuda tuya.
 * @returns  AgendaItemDisplay
 */
import type { Debt } from '@core/entities/Debt';
import type { List } from '@core/entities/List';
import type { Recurrence } from '@core/entities/Recurrence';
import type { CuotaStatus } from '@core/use-cases/ComputeDebtStatus';
import type { RecurrenceOccurrence } from '@core/use-cases/ComputeRecurringOccurrences';
import type { JarPresentation } from '@shared/styles';
import type { AgendaItemDisplay, ListDisplay } from './types';
import { jarLabelOf } from './jarOptions';

/**
 * `List` (dominio) → `ListDisplay` (presentación). El `emoji` es dato de la lista (lo eligió el
 * usuario); la `jarLabel` se DERIVA del `jarId` — la lista referencia la jarra por id, no guarda su
 * nombre. Los ítems se copian tal cual (misma forma display que dominio).
 */
export function toListDisplay(list: List): ListDisplay {
  return {
    id: list.id,
    emoji: list.emoji,
    name: list.name,
    jarLabel: jarLabelOf(list.jarId),
    items: list.items.map((i) => ({
      id: i.id,
      name: i.name,
      approxAmount: i.approxAmount,
      isChecked: i.isChecked,
    })),
  };
}

/** Solo el día: un pago que vence hoy a las 00:00 no está vencido a las 23:00 de hoy. */
export function hasPassed(dueDate: Date, today: Date): boolean {
  const due   = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return due < start;
}

/**
 * UNA cuota de una deuda — la de este mes, o una atrasada. La cuota es la unidad, no la deuda: por
 * eso lleva su `cuotaMonth`. Antes el renglón era "la deuda" y su `isPaid` preguntaba si estaba
 * saldada entera, así que cada toque cobraba otra cuota de verdad.
 * `paidCount` viene del LIBRO (`ComputeDebtStatus`), no de un contador guardado.
 */
export function toCuotaAgendaItem(
  debt: Debt,
  cuota: CuotaStatus,
  paidCount: number,
  jar: JarPresentation,
  today: Date,
): AgendaItemDisplay {
  return {
    id: `debt-${debt.id}-${cuota.month}`,
    debtId: debt.id,
    cuotaMonth: cuota.month,
    iconName: jar.iconName,
    iconColor: jar.iconColor,
    iconBg: jar.iconBg,
    name: debt.cuotas > 1
      ? `${debt.description} (${paidCount}/${debt.cuotas})`
      : debt.description,
    jarName: jar.name,
    day: cuota.dueDate.getDate(),
    amount: cuota.amount,
    isPaid: cuota.isPaid,
    isOverdue: !cuota.isPaid && hasPassed(cuota.dueDate, today),
    filter: 'deudas',
  };
}

/**
 * UNA ocurrencia de una regla recurrente — la de este mes o una atrasada. Espejo de la cuota. El
 * color lo decide el tipo, no este mapper: gasto atrasado = naranja ("vas tarde"); ingreso = verde
 * ("¿llegó?"). Un ingreso NO se atrasa (no lo debes), así que `isOverdue` solo se enciende en gastos.
 */
export function toRecurrenceAgendaItem(
  rec: Recurrence,
  occ: RecurrenceOccurrence,
  jar: JarPresentation,
  today: Date,
): AgendaItemDisplay {
  const isIncome = rec.type === 'ingreso';
  return {
    id: `rec-${rec.id}-${occ.month}`,
    recurrenceId: rec.id,
    recurrenceMonth: occ.month,
    iconName: jar.iconName,
    iconColor: jar.iconColor,
    iconBg: jar.iconBg,
    name: rec.name,
    jarName: jar.name,
    day: occ.dueDate.getDate(),
    amount: occ.amount,
    isPaid: occ.isPaid,
    isOverdue: !isIncome && !occ.isPaid && hasPassed(occ.dueDate, today),
    filter: isIncome ? 'ingresos' : 'gastos',
  };
}
