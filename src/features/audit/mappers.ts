/**
 * mappers — Audit Feature
 *
 * @what     Deriva la presentación de Revisión desde entidades de dominio. Revisión = vista derivada,
 *           sin datos propios: las metas salen de la MISMA colección que el tab Metas (goalRepository).
 * @receives goal: Goal
 * @processes emoji ← icon · progress ← progressPercent().
 * @returns  GoalDisplay
 */
import type { Goal } from '@core/entities/Goal';
import type { Debt } from '@core/entities/Debt';
import type { Transaction } from '@core/entities/Transaction';
import type { DebtStatus } from '@core/types/DebtStatus';
import type { MonthTotals } from '@core/types/Summary';
import type { JarPresentation } from '@shared/styles';
import type { GoalDisplay, DebtBreakdown, BarChartEntry, LeakDisplay, DistributionEntry } from './types';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function toBarChartEntry(totals: MonthTotals): BarChartEntry {
  const monthIndex = Number(totals.key.slice(5, 7)) - 1;
  return {
    key: totals.key,
    month: MONTHS[monthIndex],
    ingresos: totals.ingresos,
    gastos: totals.gastos,
  };
}

/** Distribución: un solo eje, la jarra. El % es sobre el gasto total del mes. */
export function toDistribution(
  spending: Map<string, number>,
  presById: Map<string, JarPresentation>,
): DistributionEntry[] {
  const total = [...spending.values()].reduce((sum, v) => sum + v, 0);
  if (total === 0) return [];

  return [...spending.entries()]
    .map(([jarId, amount]) => ({
      id: jarId,
      label: presById.get(jarId)?.name ?? 'Sin jarra',
      pct: Math.round((amount / total) * 100),
      color: presById.get(jarId)?.iconColor ?? '#999999',
    }))
    .sort((a, b) => b.pct - a.pct);
}

/** Fuga interina: un gasto de Libre = una fila. Sin agrupar, sin categoría inventada. */
export function toLeakDisplay(tx: Transaction, jar: JarPresentation): LeakDisplay {
  return {
    id: tx.id,
    iconName: jar.iconName,
    name: tx.description,
    amount: tx.amount,
    date: `${tx.date.getDate()} ${MONTHS[tx.date.getMonth()]}`,
    items: [],
  };
}

export function toGoalDisplay(goal: Goal): GoalDisplay {
  return {
    id: goal.id,
    name: goal.name,
    emoji: goal.icon,
    current: goal.currentAmount,
    target: goal.targetAmount,
    progress: Math.round(goal.progressPercent()),
  };
}

/**
 * `amount` = lo que AÚN debes de esa deuda, no lo que pediste. El donut reparte lo que queda vivo.
 * Recibe el `DebtStatus` entero, no `paidCount`: **una deuda cancelada tiene menos cuotas que
 * `debt.totalCuotas()`**, y la entidad no sabe de `cancelledAt` — quien cuenta las cuotas que
 * sobreviven es `ComputeDebtStatus`, cruzando la deuda con el libro.
 */
export function toDebtBreakdown(debt: Debt, status: DebtStatus): DebtBreakdown {
  return {
    id: debt.id,
    label: debt.description,
    amount: status.remaining,
    progress: status.totalCuotas > 0 ? Math.round((status.paidCount / status.totalCuotas) * 100) : 0,
  };
}
