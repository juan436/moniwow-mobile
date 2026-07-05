/**
 * QuickAddListPicker — Component
 *
 * @what     Modal para elegir una lista planificada y volcar sus ítems al gasto en curso.
 * @receives 4 props: visible, listas, onPick, onClose
 * @processes Muestra las listas (emoji + nombre + nº de ítems). Al tocar una, onPick(lista) la
 *           importa; el cierre lo decide el padre. Backdrop tap → onClose.
 * @returns  JSX — Modal fade con lista de opciones.
 * @props    4: visible, listas, onPick, onClose
 */
import { Modal, Pressable, View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import type { PickableList } from '../../types';

function keyExtractor(list: PickableList) { return list.id; }
function stop() { return true; }

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.popup} onStartShouldSetResponder={stop}>
          <Text style={styles.title}>Elegí una lista</Text>
          <FlatList
            data={listas}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:    { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', maxHeight: '70%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  title:    { ...typography.bodyMdBold, color: colors.navyDark, textAlign: 'center' },
  listContent: { gap: spacing.stackSm },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.lg,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
  },
  emoji:   { fontSize: 22 },
  rowText: { flex: 1 },
  name:    { ...typography.bodyMd, color: colors.navyDark },
  count:   { ...typography.labelSm, color: colors.slateGray },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
