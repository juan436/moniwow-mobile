/**
 * AllocationJarRow — Component
 *
 * @what     Fila tocable de jarra en la lista de distribución: icono + nombre + monto o "Sin asignar".
 * @receives 3 props: jar, amount, onPress
 * @processes Ninguno — solo presentación, delega la edición al numpad vía onPress.
 * @returns  JSX — card fila con icono circular, nombre, monto/placeholder y chevron.
 * @props    3: jar, amount, onPress
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import type { JarOption } from '../../types';

type Props = { jar: JarOption; amount: number; onPress: () => void };

export function AllocationJarRow({ jar, amount, onPress }: Props) {
  const hasAmount = amount > 0;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: jar.iconBg }]}>
        <MaterialIcons name={jar.iconName} size={20} color={jar.iconColor} />
      </View>
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{jar.name}</Text>
      <Text style={[styles.amount, hasAmount && styles.amountSet]}>
        {hasAmount ? `$ ${amount.toFixed(2)}` : 'Sin asignar'}
      </Text>
      <MaterialIcons name="chevron-right" size={20} color={colors.slateGray} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, backgroundColor: colors.pureWhite, borderRadius: radius.lg, paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm },
  iconCircle: { width: sizes.iconMd, height: sizes.iconMd, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  label:      { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  amount:     { ...typography.labelMd, color: colors.slateGray },
  amountSet:  { ...typography.bodyMdBold, color: colors.navyDark },
});
