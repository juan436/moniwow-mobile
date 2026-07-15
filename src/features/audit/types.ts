/**
 * types — Audit Feature
 *
 * @what Tipos de presentación del tab Revisión. No son entidades de dominio.
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

/** Dos barras por mes. El neto no se pinta: se lee en el hueco entre ellas (decisión 2026-07-14). */
export type BarChartEntry = {
  key: string;   // 'YYYY-MM'
  month: string; // etiqueta corta: 'Jul'
  ingresos: number;
  gastos: number;
};

export type LeakItem = {
  description: string;
  amount: number;
  date: string;
};

/** Fuga. **Interino**: hoy cada fila es UN gasto de la jarra Libre, sin agrupar — dato real, sin
 *  inventar categorías. Cuando la IA etiquete (M09), `name` será la categoría ("café") y `items`
 *  los gastos que la componen; entonces `isRecurring` distingue el goteo del impulso. */
export type LeakDisplay = {
  id: string;
  iconName: IconName;
  name: string;
  amount: number;
  date: string;
  items: LeakItem[];
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
