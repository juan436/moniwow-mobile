/**
 * JarSelectRow — Component
 *
 * @what     Fila tocable de jarra para elegir el origen del gasto: icono + nombre + check si activa.
 * @receives 3 props: jar, isSelected, onPress
 * @processes Ninguno — selección instantánea al tocar, sin paso intermedio.
 * @returns  JSX — card fila con icono circular, nombre y check-circle si está seleccionada.
 * @props    3: jar, isSelected, onPress
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import type { JarOption } from '../../types';

type Props = { jar: JarOption; isSelected: boolean; onPress: () => void };

export function JarSelectRow({ jar, isSelected, onPress }: Props) {
  return (
    <Pressable style={[styles.row, isSelected && styles.rowSelected]} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: jar.iconBg }]}>
        <MaterialIcons name={jar.iconName} size={20} color={jar.iconColor} />
      </View>
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{jar.name}</Text>
      {isSelected && (
        <MaterialIcons name="check-circle" size={22} color={colors.emeraldSuccess} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    backgroundColor: colors.pureWhite, borderRadius: radius.lg,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
    borderWidth: 2, borderColor: colors.transparent,
  },
  rowSelected: { borderColor: colors.emeraldSuccess },
  iconCircle:  { width: sizes.iconMd, height: sizes.iconMd, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  label:       { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
});
