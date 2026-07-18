import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarId = 'hogar' | 'fondo_seguridad' | 'goals' | 'libre';

/** Jarra real del workspace (M03: 4 base + N personalizadas — no solo hogar/fondo_seguridad/goals/libre).
 *  iconName o emoji: jarras creadas por el usuario usan emoji en vez de ícono Material. */
export type JarOption = { id: string; name: string; iconColor: string; iconBg: string; iconName?: IconName; emoji?: string };

/** Distribución de ingreso: monto en $ por id de jarra (dinámico, no fijo a 3). */
export type IncomeDistribution = Record<string, number>;

/** `amount` opcional: los ítems tecleados en Quick Add no llevan precio (llega con el OCR, M09). */
export type TransactionItem = {
  description: string;
  amount?: number;
};

/** Ítem en borrador durante el alta (Quick Add, paso Detalle): solo nombre, sin precio.
 *  El precio por ítem llegará con el escaneo IA de recibos (fuera de v1). */
export type DraftPurchaseItem = {
  id: string;
  name: string;
};

/** Lista planificada, forma neutra para el picker del Quick Add. La feature planner se mapea a
 *  este tipo en el composition root (app/) — transactions/ no importa planner/ directamente. */
export type PickableList = {
  id: string;
  name: string;
  emoji: string;
  itemNames: string[];
};

export type TransactionDisplay = {
  id: string;
  jarId: string;
  description: string;
  amount: number;
  isIncome: boolean;
  categoryLabel: string;
  time: string;
  /** Mes (0–11) y año del movimiento — para filtrar por período en TransactionsScreen. */
  month: number;
  year: number;
  iconName: IconName;
  iconBg: string;
  iconColor: string;
  isLast?: boolean;
  items?: TransactionItem[];
  receiptUri?: string;
};
