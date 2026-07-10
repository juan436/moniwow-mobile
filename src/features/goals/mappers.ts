/**
 * mappers — Goals Feature
 *
 * @what     Deriva `GoalItem` (presentación tab Metas) desde la entidad `Goal`. Display se DERIVA:
 *           progreso y estrellas salen de la entidad; `statusLabel` se calcula por bandas de progreso
 *           (antes era texto de sabor hardcodeado por meta).
 * @receives goal: Goal
 * @processes emoji ← icon · progress ← progressPercent() · statusLabel ← banda de progreso.
 * @returns  GoalItem
 */
import type { Goal } from '@core/entities/Goal';
import type { GoalItem } from './types';

/** Etiqueta motivacional derivada del % de avance (única fuente, no texto suelto por meta). */
function statusLabel(progress: number): string {
  if (progress >= 100) return '¡Meta cumplida!';
  if (progress >= 75) return '¡Ya casi!';
  if (progress >= 50) return 'Vas muy bien';
  if (progress >= 25) return 'Progreso constante';
  if (progress >= 10) return 'En camino';
  return 'Apenas comenzando';
}

export function toGoalItem(goal: Goal): GoalItem {
  const progress = Math.round(goal.progressPercent());
  return {
    id: goal.id,
    emoji: goal.icon,
    name: goal.name,
    statusLabel: statusLabel(progress),
    current: goal.currentAmount,
    target: goal.targetAmount,
    progress,
  };
}
