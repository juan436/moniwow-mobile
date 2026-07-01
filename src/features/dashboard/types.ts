/**
 * types — Dashboard Feature
 *
 * @what Tipos de presentación internos del dashboard central. No son entidades de dominio.
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarDisplay = {
  id: string;
  name: string;
  balance: number;
  iconName: IconName;
  iconBg: string;
  iconColor: string;
  progress?: number;
  isBlindado?: boolean;
};

export type TransactionItem = {
  description: string;
  amount: number;
};

export type TransactionDisplay = {
  id: string;
  description: string;
  amount: number;
  isIncome: boolean;
  categoryLabel: string;
  time: string;
  iconName: IconName;
  iconBg: string;
  iconColor: string;
  isLast?: boolean;
  items?: TransactionItem[];
  receiptUri?: string;
};

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
