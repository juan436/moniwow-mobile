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
import type { DebtWriteInput } from '@core/ports/IDebtActions';
import type { RecurrenceWriteInput } from '@core/ports/IRecurrenceActions';
import type { JarPresentation } from '@shared/styles';
import type { CreateRecurringData, RecurringDisplay } from './types';

/** Cuántos meses cubre [start, end] inclusive. */
function monthsInclusive(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

/**
 * Form del wizard → cuerpo de `POST`/`PATCH /recurrences`. Solo transporta lo que el usuario eligió:
 * el `startMonth`/`endMonth`, el id y el tipo de entidad los decide el servidor (la lógica de
 * `buildRecurrence` se mudó allá). El tipo sale del filtro (ingresos → ingreso, si no gasto).
 */
export function toRecurrenceWriteInput(d: CreateRecurringData): RecurrenceWriteInput {
  return {
    name: d.name, amount: d.amount, day: d.day,
    type: d.filter === 'ingresos' ? 'ingreso' : 'gasto',
    jarId: d.jarra, frecuencia: d.frecuencia, cuotas: d.cuotas,
  };
}

/**
 * Form del wizard → cuerpo de `POST`/`PATCH /debts`. `cuota` es el monto MENSUAL; el TOTAL
 * (`cuota × cuotas`, o la cuota sola con único pago) lo calcula el servidor. `cuotas`/`cuotasPagadas`
 * solo viajan a plazos (con único pago no aplican).
 */
export function toDebtWriteInput(d: CreateRecurringData): DebtWriteInput {
  return {
    name: d.name, cuota: d.amount, day: d.day, unicoPago: d.unicoPago,
    cuotas: d.unicoPago ? undefined : d.cuotas,
    cuotasPagadas: d.unicoPago ? undefined : d.cuotasPagadas,
    sourceJarId: d.jarra,
  };
}

export function toRecurringDisplay(rec: Recurrence, jar: JarPresentation, paymentCount: number, thisMonth: string): RecurringDisplay {
  return {
    id: rec.id, iconName: jar.iconName, iconColor: jar.iconColor, iconBg: jar.iconBg,
    name: rec.name, day: rec.dayOfMonth, amount: rec.amount,
    filter: rec.type === 'ingreso' ? 'ingresos' : 'gastos',
    jarra: rec.jarId,
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
    filter: 'deudas', jarra: debt.sourceJarId, frecuencia: 'cuotas', cuotas: debt.totalCuotas(),
    paymentCount,
    // `cancelledAt` solo lo pone CancelDebt (el fin natural es `isPaid`, no este campo): presente =
    // cancelada → sale de "activos" YA. Lo aún vencido sin pagar sigue en Atrasados vía las cuotas.
    isOver: debt.cancelledAt !== undefined,
  };
}
