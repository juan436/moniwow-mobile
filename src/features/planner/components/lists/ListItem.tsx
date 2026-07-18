/**
 * ListItem — Component
 *
 * @what     Fila de ítem de lista de compras: checkbox + nombre + monto opcional + basura opcional.
 * @receives 4 props: item, listaId, onToggle, onDelete?
 * @processes memo + useCallback — solo se redibuja si su propio isChecked cambia. Con `onDelete`
 *           muestra un icono basura al final que borra el ítem directo (barato, sin confirmación).
 * @returns  JSX — row (View) con Pressable principal (checkbox+nombre+monto) + basura opcional.
 * @props    4: item, listaId, onToggle, onDelete
 */
import { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { ListItemDisplay } from '../../types';

type Props = {
  item: ListItemDisplay;
  listaId: string;
  onToggle: (listaId: string, itemId: string) => void;
  onDelete?: (listaId: string, itemId: string) => void;
};

export const ListItem = memo(function ListItem({ item, listaId, onToggle, onDelete }: Props) {
  const handlePress = useCallback(
    () => onToggle(listaId, item.id),
    [listaId, item.id, onToggle],
  );
  const handleDelete = useCallback(
    () => onDelete?.(listaId, item.id),
    [listaId, item.id, onDelete],
  );

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.main, item.isChecked && styles.rowDone]}
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
      {onDelete !== undefined && (
        <Pressable onPress={handleDelete} hitSlop={8} style={styles.trash}>
          <MaterialIcons name="delete-outline" size={sizes.iconSm} color={colors.slateGray} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  main: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, flex: 1 },
  trash: { padding: spacing.stackXs },
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
