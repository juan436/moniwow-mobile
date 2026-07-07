/**
 * JarPreview — Component
 *
 * @what     Vista previa de una jarra en el paso final del asistente Crear/Editar jarra: muestra la
 *           card real (JarItem) tal cual se verá en la pantalla Mis Jarras.
 * @receives 5 props: name, iconName, targetAmount, isBlindado, balance?
 * @processes Arma un JarDisplay a partir del form y lo renderiza con el mismo JarItem del grid (única
 *           fuente de verdad del aspecto). Card centrada de ancho fijo + caption de presupuesto.
 *           Reemplaza el cluster de chips anterior (se veía amontonado).
 * @returns  JSX — encabezado + JarItem centrado + caption opcional.
 * @props    5: name, iconName, targetAmount, isBlindado, balance?
 */
import { View, Text, StyleSheet } from 'react-native';
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing } from '@shared/styles';
import { JarItem } from './JarItem';
import type { JarDisplay } from '../types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type Props = { name: string; iconName: IconName | null; targetAmount?: number; isBlindado?: boolean; balance?: number };

export function JarPreview({ name, iconName, targetAmount, isBlindado, balance = 0 }: Props) {
  const display: JarDisplay = {
    id: 'preview',
    name: name.trim() || 'Jarra sin nombre',
    balance,
    iconBg: colors.emeraldTint,
    iconColor: colors.emeraldSuccess,
    iconName: iconName ?? undefined,
    progress: targetAmount !== undefined ? Math.min(100, Math.round((balance / targetAmount) * 100)) : undefined,
    targetAmount,
    isBlindado,
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Así se verá tu jarra</Text>
      <View style={styles.cardSlot}>
        <JarItem jar={display} />
      </View>
      {targetAmount !== undefined && (
        <Text style={styles.caption}>Presupuesto mensual: $ {targetAmount.toLocaleString('es')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:     { alignItems: 'center', gap: spacing.stackMd, paddingVertical: spacing.stackSm },
  heading:  { ...typography.labelSm, color: colors.onSurfaceVariant },
  cardSlot: { width: 200 },
  caption:  { ...typography.labelMd, color: colors.slateGray },
});
