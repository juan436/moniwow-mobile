/**
 * jarPresentation — Design System (jarras)
 *
 * @what     Regla de diseño: color de una jarra según su `type` (NO se almacena, se deriva). Fuente
 *           única para pintar jarras — la usan jars/ y transactions/ sin acoplarse entre features.
 * @receives type: JarType · jar: Jar (entidad de dominio)
 * @processes colorByType mapea tipo→{iconBg,iconColor}. toJarPresentation añade nombre e ícono del dominio.
 * @returns  JarColors / JarPresentation
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

import type { Jar, JarType } from '@core/entities/Jar';
import { colors } from './theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarColors = { iconBg: string; iconColor: string };

/** Color por rol de jarra. Custom = default; el día que el usuario elija color, será dato (campo `color?`). */
const JAR_COLORS: Record<JarType, JarColors> = {
  libre:           { iconBg: colors.primary + '1A',        iconColor: colors.primary },
  hogar:           { iconBg: colors.inversePrimary + '33', iconColor: colors.primary },
  fondo_seguridad: { iconBg: colors.emeraldSuccess + '1A', iconColor: colors.emeraldSuccess },
  goals:           { iconBg: colors.goldDreams + '1A',     iconColor: colors.goldDreams },
  custom:          { iconBg: colors.emeraldTint,           iconColor: colors.emeraldSuccess },
};

export function colorByType(type: JarType): JarColors {
  return JAR_COLORS[type];
}

export type JarPresentation = {
  name: string;
  iconName: IconName;
  iconBg: string;
  iconColor: string;
};

/** Entidad Jar → presentación: nombre e ícono son del dominio; el color se deriva del tipo. */
export function toJarPresentation(jar: Jar): JarPresentation {
  return {
    name: jar.name,
    iconName: jar.icon as IconName,
    ...colorByType(jar.type),
  };
}
