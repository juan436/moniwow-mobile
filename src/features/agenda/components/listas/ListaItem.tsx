/**
 * ListaItem — Component
 *
 * @what     Fila de ítem de lista de compras: checkbox + nombre + monto opcional.
 * @receives 3 props: item, listaId, onToggle
 * @processes memo + useCallback — solo se redibuja si su propio isChecked cambia.
 * @returns  JSX — Pressable row con estado checked.
 * @props    3: item, listaId, onToggle
 */
import { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { ListaItemDisplay } from '../../types';

type Props = {
  item: ListaItemDisplay;
  listaId: string;
  onToggle: (listaId: string, itemId: string) => void;
};

export const ListaItem = memo(function ListaItem({ item, listaId, onToggle }: Props) {
  const handlePress = useCallback(
    () => onToggle(listaId, item.id),
    [listaId, item.id, onToggle],
  );

  return (
    <Pressable
      style={[styles.row, item.isChecked && styles.rowDone]}
      onPress={handlePress}
      hitSlop={4}
    >
      <View style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}>
        {item.isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.name, item.isChecked && styles.nameDone]} numberOfLines={1} ellipsizeMode="tail">
        {truncateLabel(item.name, 20)}
      </Text>
      {item.approxAmount !== undefined && (
        <Text style={[styles.amount, item.isChecked && styles.amountDone]}>
          $ {item.approxAmount.toFixed(2)}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  rowDone: { opacity: 0.45 },
  checkbox: {
    width: sizes.checkboxSm, height: sizes.checkboxSm, borderRadius: radius.sm,
    borderWidth: 2, borderColor: colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  checkmark: { color: colors.pureWhite, fontSize: typography.labelMd.fontSize },
  name: { ...typography.labelMd, color: colors.onSurface, flex: 1 },
  nameDone: { textDecorationLine: 'line-through' },
  amount: { ...typography.labelSm, color: colors.slateGray },
  amountDone: { textDecorationLine: 'line-through' },
});
