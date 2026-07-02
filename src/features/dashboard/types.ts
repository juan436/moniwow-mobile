/**
 * types — Dashboard Feature
 *
 * @what Tipos de presentación internos del dashboard central. No son entidades de dominio.
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type UpcomingExpense = {
  id: string;
  name: string;
  urgency: string;
  amount: number;
  iconName: IconName;
};

export type GoalHighlight = {
  id: string;
  name: string;
  emoji: string;
  progress: number;
  current: number;
  target: number;
};
