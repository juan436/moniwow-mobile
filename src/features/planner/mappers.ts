/**
 * mappers — Planner Feature
 *
 * @what     Deriva los compromisos de la Agenda desde el dominio. La Agenda no tiene datos propios.
 * @receives item: PendingItem · debt: Debt · jar: JarPresentation (la jarra dueña) · today: Date
 * @processes Ícono y color salen de la JARRA, no de un emoji guardado aparte.
 *           **Las deudas no son `pendingItems`**: se derivan de la colección `debts` (C2). Una deuda
 *           con cuotas pendientes YA es un compromiso mensual — su `cuotaAmount()` en su `dueDate`.
 *           Sembrarlas también en `pendingItems` era duplicar la colección.
 *           `isOverdue` se deriva de la fecha, no se guarda: un `status: 'atrasado'` en la BD habría
 *           que recalcularlo cada día, y el día que nadie lo haga, la app miente. **Solo pagos y
 *           cuotas se atrasan** — un ingreso que no llegó no es una deuda tuya.
 * @returns  AgendaItemDisplay
 */
import type { Debt } from '@core/entities/Debt';
import type { List } from '@core/entities/List';
import type { CuotaStatus } from '@core/use-cases/ComputeDebtStatus';
import type { PendingItem } from '@core/ports/IAgendaRepository';
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

export function toAgendaItem(item: PendingItem, jar: JarPresentation, today: Date): AgendaItemDisplay {
  const isPaid = item.status === 'confirmado';

  return {
    id: item.id,
    iconName: jar.iconName,
    iconColor: jar.iconColor,
    iconBg: jar.iconBg,
    name: item.description,
    jarName: jar.name,
    day: item.dueDate.getDate(),
    amount: item.amount,
    isPaid,
    // **Solo pagos y deudas se atrasan.** Un ingreso que no llegó no es una deuda tuya: no lo
    // debes, no lo puedes pagar, y marcarlo de vencido solo añade ruido a la pantalla.
    isOverdue: item.type === 'pago' && !isPaid && hasPassed(item.dueDate, today),
    filter: item.type === 'ingreso' ? 'ingresos' : 'gastos',
  };
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
