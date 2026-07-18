/**
 * listBadge — Utilidad
 *
 * @what     Color del badge de una lista según su jarra. Antes vivía dentro de `ListCard`; salió
 *           acá para que `ListRow` (índice) y `ListDetailScreen` (detalle) lo compartan sin duplicar.
 * @receives jarLabel: string — la etiqueta derivada de la jarra (ej. "Hogar").
 * @returns  string — color del token, o navyDark si no matchea ninguna jarra conocida.
 */
import { colors } from '@shared/styles';

const JAR_COLORS: { key: string; color: string }[] = [
  { key: 'Hogar', color: colors.tertiary },
  { key: 'Libre', color: colors.emeraldSuccess },
  { key: 'Metas', color: colors.secondary },
];

export function getBadgeColor(jarLabel: string): string {
  return JAR_COLORS.find(({ key }) => jarLabel.includes(key))?.color ?? colors.navyDark;
}
