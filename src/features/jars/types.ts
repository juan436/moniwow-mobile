/**
 * types — Jars Feature
 *
 * @what Tipos de presentación del dominio jarras. No son entidades de dominio (ver core/entities/Jar.ts).
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export type JarDisplay = {
  id: string;
  name: string;
  balance: number;
  iconBg: string;
  iconColor: string;
  iconName?: IconName;
  emoji?: string;
  progress?: number;
  isBlindado?: boolean;
};

export type CreateJarData = { name: string; emoji: string };
