/**
 * jarOptions — Planner (catálogo de jarras)
 *
 * @what     Jarras seleccionables en los asistentes del Planner (deuda / recurrente / lista) +
 *           resolución jarId → etiqueta. Fuente ÚNICA de la etiqueta de jarra en la capa Planner:
 *           antes vivía dentro de RecurringJarSelector, ahora la comparten selector, preview y mapper.
 * @receives —
 * @processes Mapa key→label+ícono (MaterialIcons reales, mismo set que IconPicker de Jarras).
 *           `jarLabelOf` busca por id; si no está, devuelve el id crudo (no inventa).
 * @returns  RECURRING_JARS, jarLabelOf
 */
import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import type { RecurringJar } from './types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export const RECURRING_JARS: { key: RecurringJar; label: string; iconName: IconName }[] = [
  { key: 'hogar',       label: 'Hogar',        iconName: 'home' },
  { key: 'goals',       label: 'Metas',        iconName: 'savings' },
  { key: 'libre',       label: 'Libre',        iconName: 'account-balance-wallet' },
  { key: 'transporte',  label: 'Transporte',   iconName: 'directions-bus' },
  { key: 'salud',       label: 'Salud',        iconName: 'favorite' },
  { key: 'educacion',   label: 'Educación',    iconName: 'school' },
  { key: 'viajes',      label: 'Viajes',       iconName: 'flight' },
  { key: 'emergencias', label: 'Emergencias',  iconName: 'security' },
  { key: 'ocio',        label: 'Ocio',         iconName: 'sports-esports' },
];

/** jarId ('hogar', 'libre'…) → etiqueta legible. La jarra se referencia por id; su nombre se deriva. */
export function jarLabelOf(jarId: string): string {
  return RECURRING_JARS.find((j) => j.key === jarId)?.label ?? jarId;
}
