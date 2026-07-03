/**
 * types — Goals Feature
 *
 * @what Tipos de presentación del tab Metas (M10). No son entidades de dominio.
 */

export type GoalItem = {
  id: string;
  emoji: string;
  name: string;
  statusLabel: string;
  current: number;
  target: number;
  progress: number;
};

export type CreateGoalData = { name: string; icon: string; targetAmount: number };
export type SaveGoalData = CreateGoalData & { id: string };
