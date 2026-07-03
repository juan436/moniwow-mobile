/**
 * ListCard — Component
 *
 * @what     Card de lista: badge-etiqueta en borde superior + header + checklist + añadir ítem.
 * @receives 5 props: lista, onToggle, onAddItem, isSelected?, onLongPress
 * @processes Badge flotante sobre borde. Header: emojiBox + nombre. Ítems compactos. Long press → selección.
 * @returns  JSX — Wrapper con badge absoluto + card con shadow.
 * @props    5: lista, onToggle, onAddItem, isSelected, onLongPress
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { ListDisplay } from '../../types';
import { ListItem } from './ListItem';

type Props = {
  lista: ListDisplay;
  onToggle: (listaId: string, itemId: string) => void;
  onAddItem: (listaId: string, listaName: string) => void;
  isSelected?: boolean;
  onLongPress: (listaId: string) => void;
};

const JAR_COLORS: { key: string; color: string }[] = [
  { key: 'Hogar',  color: colors.tertiary },
  { key: 'Libre',  color: colors.emeraldSuccess },
  { key: 'Metas',  color: colors.secondary },
];

function getBadgeColor(jarLabel: string): string {
  return JAR_COLORS.find(({ key }) => jarLabel.includes(key))?.color ?? colors.navyDark;
}

export function ListCard({ lista, onToggle, onAddItem, isSelected = false, onLongPress }: Props) {
  const badgeColor = getBadgeColor(lista.jarLabel);

  const handleAddItem  = useCallback(() => onAddItem(lista.id, lista.name), [lista.id, lista.name, onAddItem]);
  const handleLongPress = useCallback(() => onLongPress(lista.id), [lista.id, onLongPress]);

  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.card, shadows.card, isSelected && styles.cardSelected]} onLongPress={handleLongPress} delayLongPress={400}>

        <View style={styles.header}>
          <View style={styles.emojiBox}>
            <Text style={styles.emoji}>{lista.emoji}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(lista.name)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemList}>
          {lista.items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              listaId={lista.id}
              onToggle={onToggle}
            />
          ))}
          <Pressable style={styles.btnAddItem} onPress={handleAddItem} hitSlop={8}>
            <Text style={styles.btnAddItemText}>Añadir ítem</Text>
          </Pressable>
        </View>

      </Pressable>

      <View style={[styles.tag, { backgroundColor: badgeColor }]}>
        <Text style={styles.tagLabel}>{lista.jarLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: spacing.stackSm },
  card: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.xl,
    padding: spacing.cardPadding, gap: spacing.stackSm,
    borderWidth: 1, borderColor: colors.surfaceContainerHighest,
  },
  cardSelected: { borderColor: colors.emeraldSuccess, borderWidth: 2 },
  tag: {
    position: 'absolute', top: -spacing.stackSm, right: spacing.stackMd,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs,
  },
  tagLabel: { ...typography.labelXs, color: colors.pureWhite },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  emojiBox: {
    width: sizes.iconSm, height: sizes.iconSm,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: sizes.emojiFontMd },
  name: { ...typography.labelMdBold, color: colors.navyDark, flex: 1 },
  divider: { height: 1, backgroundColor: colors.outlineVariant + '33' },
  itemList: { gap: spacing.stackSm },
  btnAddItem: { paddingTop: spacing.stackSm, alignSelf: 'flex-start' },
  btnAddItemText: { ...typography.labelSm, color: colors.primary },
});
