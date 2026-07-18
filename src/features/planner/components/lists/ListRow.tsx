/**
 * ListRow — Component
 *
 * @what     Fila compacta de una lista en el índice: emoji + nombre + badge de jarra + progreso
 *           (comprados/total con barra) + chevron. Tap → abre la page de la lista.
 * @receives 3 props: lista, onPress, onDelete
 * @processes Deriva el progreso de los ítems (comprados/total). Swipe-left revela Eliminar
 *           (`Swipeable`, gesture-handler); `PlannerScreen` no es pager horizontal → no choca.
 * @returns  JSX — Swipeable con la fila + acción Eliminar a la derecha.
 * @props    3: lista, onPress, onDelete
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { ListDisplay } from '../../types';
import { getBadgeColor } from './listBadge';

type Props = {
  lista: ListDisplay;
  onPress: (listaId: string) => void;
  onDelete: (listaId: string) => void;
};

export function ListRow({ lista, onPress, onDelete }: Props) {
  const done  = lista.items.filter((i) => i.isChecked).length;
  const total = lista.items.length;
  const ratio = total === 0 ? 0 : done / total;
  const badgeColor = getBadgeColor(lista.jarLabel);

  const handlePress  = useCallback(() => onPress(lista.id), [lista.id, onPress]);
  const handleDelete = useCallback(() => onDelete(lista.id), [lista.id, onDelete]);

  const renderRightActions = useCallback(() => (
    <View style={styles.deleteWrap}>
      <Pressable style={styles.deleteAction} onPress={handleDelete}>
        <MaterialIcons name="delete-outline" size={20} color={colors.onError} />
      </Pressable>
    </View>
  ), [handleDelete]);

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <Pressable style={[styles.row, shadows.card]} onPress={handlePress}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{lista.emoji}</Text>
        </View>
        <View style={styles.middle}>
          <View style={styles.titleLine}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(lista.name)}</Text>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeLabel}>{lista.jarLabel}</Text>
            </View>
          </View>
          <Text style={styles.progress}>{done}/{total} comprados</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={sizes.iconMd} color={colors.outlineVariant} />
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl,
    padding: spacing.cardPadding,
    borderWidth: 1, borderColor: colors.surfaceContainerHighest,
  },
  emojiBox: { width: sizes.iconMd, height: sizes.iconMd, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: sizes.emojiFontMd },
  middle:   { flex: 1, gap: spacing.stackXs },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  name:      { ...typography.labelMdBold, color: colors.navyDark, flexShrink: 1 },
  badge:     { borderRadius: radius.sm, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs },
  badgeLabel: { ...typography.labelXs, color: colors.pureWhite },
  progress:  { ...typography.labelSm, color: colors.slateGray },
  track:     { height: 4, borderRadius: radius.full, backgroundColor: colors.surfaceContainerHighest, overflow: 'hidden' },
  fill:      { height: '100%', borderRadius: radius.full, backgroundColor: colors.emeraldSuccess },
  deleteWrap:   { justifyContent: 'center', marginLeft: spacing.stackSm, paddingVertical: spacing.stackXs },
  deleteAction: {
    width: 52, height: '100%', borderRadius: radius.lg,
    backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center',
  },
});
