/**
 * types — Audit Feature
 *
 * @what Tipos de presentación del tab Revisión. No son entidades de dominio.
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type BarChartEntry = {
  month: string;
  amount: number;
};

export type FugaItem = {
  description: string;
  amount: number;
  date: string;
};

export type FugaDisplay = {
  id: string;
  iconName: IconName;
  name: string;
  amount: number;
  items: FugaItem[];
};

export type GoalDisplay = {
  id: string;
  name: string;
  emoji: string;
  current: number;
  target: number;
  progress: number;
};

export type DebtBreakdown = {
  id: string;
  label: string;
  amount: number;
  progress: number;
};

export type DistributionEntry = {
  id: string;
  label: string;
  pct: number;
  color: string;
};
