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
import type { GoalDisplay, DebtBreakdown } from './types';

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

/** progress = % de cuotas pagadas (deriva de la entidad, no texto suelto). */
export function toDebtBreakdown(debt: Debt): DebtBreakdown {
  return {
    id: debt.id,
    label: debt.description,
    amount: debt.amount,
    progress: debt.cuotas > 0 ? Math.round((debt.paidCuotas / debt.cuotas) * 100) : 0,
  };
}
