import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarId = 'hogar' | 'fondo_seguridad' | 'goals' | 'libre';

/** Jarra real del workspace (M03: 4 base + N personalizadas — no solo hogar/fondo_seguridad/goals/libre).
 *  iconName o emoji: jarras creadas por el usuario usan emoji en vez de ícono Material. */
export type JarOption = { id: string; name: string; iconColor: string; iconBg: string; iconName?: IconName; emoji?: string };

/** Distribución de ingreso: monto en $ por id de jarra (dinámico, no fijo a 3). */
export type IncomeDistribution = Record<string, number>;

export type TransactionItem = {
  description: string;
  amount: number;
};

export type TransactionDisplay = {
  id: string;
  jarId: string;
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
