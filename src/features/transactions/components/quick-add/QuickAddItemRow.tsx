/**
 * QuickAddItemRow — Component
 *
 * @what     Fila de un ítem en el paso Detalle del Quick Add: nombre + botón quitar.
 * @receives 3 props: id, name, onRemove
 * @processes handleRemove llama onRemove(id) — handler propio para no crear closures inline
 *           en el renderItem del FlatList padre (code_rules §9).
 * @returns  JSX — fila con nombre a la izquierda y botón X a la derecha.
 * @props    3: id, name, onRemove
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';

type Props = {
  id: string;
  name: string;
  onRemove: (id: string) => void;
};

export function QuickAddItemRow({ id, name, onRemove }: Props) {
  function handleRemove() { onRemove(id); }

  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
      <Pressable onPress={handleRemove} hitSlop={8}>
        <MaterialIcons name="close" size={20} color={colors.slateGray} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: spacing.stackMd,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
  },
  name: { flex: 1, ...typography.bodyMd, color: colors.navyDark },
});
