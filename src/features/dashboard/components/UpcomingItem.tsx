/**
 * UpcomingItem — Component
 *
 * @what     Fila de vencimiento próximo: icono + nombre + urgencia + monto.
 * @receives 3 props: item, isLast, onLongPress
 * @processes Renderiza fila con separador condicional. Abre detalle en long-press.
 * @returns  JSX — Pressable row con icono circular y textos.
 * @props    3: item, isLast, onLongPress
 */
import { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { UpcomingExpense } from '../types';

type Props = { item: UpcomingExpense; isLast: boolean; onLongPress?: (item: UpcomingExpense) => void };

export const UpcomingItem = memo(function UpcomingItem({ item, isLast, onLongPress }: Props) {
  const isUrgent = item.urgency === 'Mañana' || item.urgency.startsWith('En 1');
  const handleLongPress = useCallback(() => onLongPress?.(item), [onLongPress, item]);

  return (
    <Pressable style={[styles.row, !isLast && styles.border]} onLongPress={handleLongPress} delayLongPress={400}>
      <View style={[styles.icon, isUrgent && styles.iconUrgent]}>
        <MaterialIcons name={item.iconName} size={18} color={isUrgent ? colors.alertOrange : colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(item.name, 18)}</Text>
        <Text style={[styles.urgency, isUrgent && styles.urgencyUrgent]}>{item.urgency}</Text>
      </View>
      <Text style={[styles.amount, isUrgent && styles.amountUrgent]}>-$ {item.amount}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackMd },
  border:  { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '33' },
  icon: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.primary + '1A', alignItems: 'center', justifyContent: 'center',
  },
  iconUrgent:    { backgroundColor: colors.alertOrange + '1A' },
  info:          { flex: 1 },
  name:          { ...typography.labelMd, color: colors.navyDark },
  urgency:       { ...typography.labelXs, color: colors.slateGray },
  urgencyUrgent: { color: colors.alertOrange },
  amount:        { ...typography.labelMd, color: colors.navyDark },
  amountUrgent:  { color: colors.alertOrange },
});
