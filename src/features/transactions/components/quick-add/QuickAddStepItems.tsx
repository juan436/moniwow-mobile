/**
 * QuickAddStepItems — Component
 *
 * @what     Paso 2 Quick Add (Detalle, opcional): ítems comprados a mano o traídos de una lista.
 * @receives 5 props: items, onAddItem, onRemoveItem, onNext, listImport
 * @processes Input local para tipear un ítem (Añadir/submit agrega y limpia). "Desde una lista" abre
 *           un picker que vuelca los ítems de una lista planificada. Omitir y Continuar hacen lo mismo
 *           (onNext) — el paso es opcional. Sin precio por ítem por ahora (escaneo IA fuera de v1).
 * @returns  JSX — input Añadir + botón Desde una lista + FlatList de ítems + footer + picker modal.
 * @props    5: items, onAddItem, onRemoveItem, onNext, listImport
 */
import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';
import { QuickAddItemRow } from './QuickAddItemRow';
import { QuickAddListPicker } from './QuickAddListPicker';
import type { DraftPurchaseItem, PickableList } from '../../types';

function keyExtractor(item: DraftPurchaseItem) { return item.id; }

type Props = {
  items: DraftPurchaseItem[];
  onAddItem: (name: string) => void;
  onRemoveItem: (id: string) => void;
  onNext: () => void;
  listImport: { listas: PickableList[]; onImport: (list: PickableList) => void };
};

export function QuickAddStepItems({ items, onAddItem, onRemoveItem, onNext, listImport }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const handleAdd = useCallback(() => {
    onAddItem(draft);
    setDraft('');
  }, [draft, onAddItem]);

  const handlePick = useCallback((list: PickableList) => {
    listImport.onImport(list);
    setShowPicker(false);
  }, [listImport]);

  const renderItem = useCallback(
    ({ item }: { item: DraftPurchaseItem }) => (
      <QuickAddItemRow id={item.id} name={item.name} onRemove={onRemoveItem} />
    ),
    [onRemoveItem]
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="¿Qué compraste?"
          placeholderTextColor={colors.slateGray}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          blurOnSubmit={false}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd} hitSlop={8}>
          <MaterialIcons name="add" size={24} color={colors.pureWhite} />
        </Pressable>
      </View>

      {listImport.listas.length > 0 && (
        <Pressable style={styles.listBtn} onPress={() => setShowPicker(true)}>
          <MaterialIcons name="playlist-add-check" size={20} color={colors.primary} />
          <Text style={styles.listBtnText}>Desde una lista</Text>
        </Pressable>
      )}

      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>Añadí lo que compraste, o toca Omitir.</Text>}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.stackLg }]}>
        <Pressable style={styles.omitir} onPress={onNext} hitSlop={8}>
          <Text style={styles.omitirText}>Omitir</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={onNext}>
          <Text style={styles.btnText}>Continuar</Text>
        </Pressable>
      </View>

      <QuickAddListPicker
        visible={showPicker}
        listas={listImport.listas}
        onPick={handlePick}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: spacing.stackMd, paddingTop: spacing.stackMd },
  addRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    marginHorizontal: spacing.marginPage,
  },
  input: {
    flex: 1, ...typography.bodyMd, color: colors.navyDark,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
  },
  addBtn: {
    width: spacing.inputHeight, height: spacing.inputHeight,
    backgroundColor: colors.emeraldSuccess, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },

  listBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.stackSm,
    marginHorizontal: spacing.marginPage,
    paddingVertical: spacing.stackSm,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.primary,
  },
  listBtnText: { ...typography.labelMd, color: colors.primary },
  list:        { flex: 1 },
  listContent: { paddingHorizontal: spacing.marginPage, gap: spacing.stackSm, paddingBottom: spacing.stackMd },
  empty:       { ...typography.bodyMd, color: colors.slateGray, textAlign: 'center', paddingTop: spacing.stackLg },

  footer: { paddingHorizontal: spacing.marginPage, flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd },
  omitir:     { paddingVertical: spacing.stackMd, paddingHorizontal: spacing.stackMd },
  omitirText: { ...typography.labelMd, color: colors.slateGray },
  btn: {
    flex: 1, height: spacing.buttonHeight,
    backgroundColor: colors.emeraldSuccess, borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  btnText: { ...typography.labelMd, color: colors.pureWhite },
});
