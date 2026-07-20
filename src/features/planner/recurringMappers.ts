/**
 * recurringMappers — Utilidad
 *
 * @what     Traduce entre el tab Recurrentes y el dominio: `CreateRecurringData` → entidad
 *           (`Recurrence` / `Debt`) y entidad → `RecurringDisplay`.
 * @receives N/A — funciones puras, sin estado propio.
 * @processes Salieron de `useRecurrentes` cuando pasó de 150 líneas (code_rules): no necesitan el
 *           hook, solo sus datos.
 *           **`monto` es MENSUAL**: para una deuda a plazos es la cuota, y el total = cuota ×
 *           cuotas. Con único pago el monto YA es el total y no se multiplica por nada.
 *           `isOver` = "terminó", NO "tiene fin": una regla con duración 12 meses tiene `endMonth`
 *           y sigue viva. Filtra "Compromisos activos"; lo vencido sin pagar sigue en Mi Mes.
 * @returns  Recurrence · Debt · RecurringDisplay.
 */
import { Debt } from '@core/entities/Debt';
import { Recurrence } from '@core/entities/Recurrence';
import { monthKey } from '@core/utils/monthKey';
import { asRecurringJar } from './jarOptions';
import type { JarPresentation } from '@shared/styles';
import type { CreateRecurringData, RecurringDisplay } from './types';

const WORKSPACE_ID = 'ws1';

/** 'YYYY-MM' + n meses. */
function addMonths(month: string, n: number): string {
  const [year, m] = month.split('-').map(Number);
  return monthKey(new Date(year, m - 1 + n, 1));
}

/** Cuántos meses cubre [start, end] inclusive. */
function monthsInclusive(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

export function buildRecurrence(d: CreateRecurringData, id: string, startMonth: string): Recurrence {
  return new Recurrence({
    id, name: d.name, amount: d.amount,
    type: d.filter === 'ingresos' ? 'ingreso' : 'gasto',
    dayOfMonth: d.day, jarId: d.jarra, startMonth,
    endMonth: d.frecuencia === 'cuotas' ? addMonths(startMonth, d.cuotas - 1) : undefined,
    workspaceId: WORKSPACE_ID,
  });
}

/**
 * Único pago: `cuotas` queda ausente y el total ES el monto (no se multiplica por nada — con
 * `cuotas: 0` el total daría 0). A plazos: total = cuota × cuotas, como siempre.
 */
export function buildDebt(d: CreateRecurringData, id: string, createdAt: Date, origin: Debt['origin']): Debt {
  return new Debt({
    id, description: d.name,
    amount: d.unicoPago ? d.amount : d.amount * d.cuotas,
    cuotas: d.unicoPago ? undefined : d.cuotas,
    cuotasPagadas: d.unicoPago ? undefined : d.cuotasPagadas,
    dueDay: d.day, sourceJarId: d.jarra, workspaceId: WORKSPACE_ID, createdAt, origin,
  });
}

export function toRecurringDisplay(rec: Recurrence, jar: JarPresentation, paymentCount: number, thisMonth: string): RecurringDisplay {
  return {
    id: rec.id, iconName: jar.iconName, iconColor: jar.iconColor, iconBg: jar.iconBg,
    name: rec.name, day: rec.dayOfMonth, amount: rec.amount,
    filter: rec.type === 'ingreso' ? 'ingresos' : 'gastos',
    jarra: asRecurringJar(rec.jarId),
    frecuencia: rec.endMonth ? 'cuotas' : 'indefinido',
    cuotas: rec.endMonth ? monthsInclusive(rec.startMonth, rec.endMonth) : 12,
    paymentCount,
    // Sale de "activos" si se canceló (marca propia, aunque `endMonth` sea este mes) o si una
    // regla finita ya terminó. Lo aún vencido sin pagar sigue en Mi Mes vía `endMonth`.
    isOver: rec.cancelledAt !== undefined || (rec.endMonth !== undefined && rec.endMonth < thisMonth),
  };
}

export function toDebtRecurringDisplay(debt: Debt, jar: JarPresentation, paymentCount: number, thisMonth: string): RecurringDisplay {
  return {
    id: debt.id, iconName: jar.iconName, iconColor: jar.iconColor, iconBg: jar.iconBg,
    name: debt.description, day: debt.dueDay, amount: debt.cuotaAmount(),
    filter: 'deudas', jarra: asRecurringJar(debt.sourceJarId), frecuencia: 'cuotas', cuotas: debt.totalCuotas(),
    paymentCount,
    // `cancelledAt` solo lo pone CancelDebt (el fin natural es `isPaid`, no este campo): presente =
    // cancelada → sale de "activos" YA. Lo aún vencido sin pagar sigue en Atrasados vía las cuotas.
    isOver: debt.cancelledAt !== undefined,
  };
}
