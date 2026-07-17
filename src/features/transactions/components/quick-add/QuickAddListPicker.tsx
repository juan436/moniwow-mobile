/**
 * QuickAddListPicker — Component
 *
 * @what     Sheet para elegir una lista planificada y volcar sus ítems al gasto en curso.
 * @receives 4 props: visible, listas, onPick, onClose
 * @processes Muestra las listas (emoji + nombre + nº de ítems). Al tocar una, onPick(lista) la
 *           importa; el cierre lo decide el padre. Tocar el fondo → onClose.
 *           El título va como header de `MoniSheet` en vez de armar uno propio. El `FlatList`
 *           scrollea contra el `maxHeight: 90%` de la hoja — por eso el chrome no trae ScrollView:
 *           se anidaría con este.
 * @returns  JSX — sheet con la lista de opciones.
 * @props    4: visible, listas, onPick, onClose
 */
import { Pressable, View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniSheet } from '@shared/components';
import type { PickableList } from '../../types';

function keyExtractor(list: PickableList) { return list.id; }

type Props = {
  visible: boolean;
  listas: PickableList[];
  onPick: (list: PickableList) => void;
  onClose: () => void;
};

export function QuickAddListPicker({ visible, listas, onPick, onClose }: Props) {
  const insets = useSafeAreaInsets();

  function renderItem({ item }: { item: PickableList }) {
    return (
      <Pressable style={styles.row} onPress={() => onPick(item)}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.count}>{item.itemNames.length} ítems</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.slateGray} />
      </Pressable>
    );
  }

  return (
    <MoniSheet visible={visible} onClose={onClose} title="Elegí una lista">
      <FlatList
        data={listas}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.stackLg }]}
        showsVerticalScrollIndicator={false}
      />
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  listContent: { gap: spacing.stackSm, paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackMd },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.lg,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
  },
  emoji:   { fontSize: 22 },
  rowText: { flex: 1 },
  name:    { ...typography.bodyMd, color: colors.navyDark },
  count:   { ...typography.labelSm, color: colors.slateGray },
});
