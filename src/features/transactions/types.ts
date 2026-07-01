import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarId = 'hogar' | 'ahorro' | 'libre';

/** Jarra real del workspace (M03: 3 base + N personalizadas — no solo hogar/ahorro/libre).
 *  iconName o emoji: jarras creadas por el usuario usan emoji en vez de ícono Material. */
export type JarOption = { id: string; name: string; iconColor: string; iconBg: string; iconName?: IconName; emoji?: string };

/** Distribución de ingreso: monto en $ por id de jarra (dinámico, no fijo a 3). */
export type IncomeDistribution = Record<string, number>;
