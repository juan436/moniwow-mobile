/**
 * types — Jars Feature
 *
 * @what Tipos de presentación del dominio jarras. No son entidades de dominio (ver core/entities/Jar.ts).
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';
import type { JarType } from '@core/entities/Jar';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarDisplay = {
  id: string;
  type: JarType;
  name: string;
  balance: number;
  iconBg: string;
  iconColor: string;
  iconName?: IconName;
  emoji?: string;
  progress?: number;
  targetAmount?: number;
  isBlindado?: boolean;
  /** Balance < 0: la jarra quedó "en rojo" (M03 §3). Deriva de `Jar.isNegative()`. */
  isNegative?: boolean;
};

export type CreateJarData = { name: string; iconName: IconName; targetAmount?: number; isBlindado?: boolean };
export type SaveJarData   = CreateJarData & { id: string };
