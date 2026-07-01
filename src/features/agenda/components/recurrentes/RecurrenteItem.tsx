/**
 * RecurrenteItem — Component
 *
 * @what     Fila de compromiso recurrente: ícono (MaterialIcons), nombre → monto → día, botón Editar.
 * @receives 2 props: item, onEdit
 * @processes Usa iconColor e iconBg del dato para el contenedor del ícono.
 * @returns  JSX — Card horizontal con shadow.
 * @props    2: item, onEdit
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { RecurrenteDisplay } from '../../types';

type Props = {
  item: RecurrenteDisplay;
  onEdit: (id: string) => void;
};

export function RecurrenteItem({ item, onEdit }: Props) {
  function handleEdit() { onEdit(item.id); }

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          <MaterialIcons name={item.iconName} size={22} color={item.iconColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(item.name)}</Text>
          <Text style={styles.amount}>$ {item.amount.toLocaleString('es')}.00</Text>
          <Text style={styles.meta}>Día {item.day}</Text>
        </View>
        <Pressable style={styles.editBtn} onPress={handleEdit} hitSlop={8}>
          <Text style={styles.editText}>Editar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.card, padding: spacing.stackMd },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  iconBox: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { ...typography.labelMdBold, color: colors.navyDark },
  amount: { ...typography.labelMd, color: colors.emeraldSuccess, marginTop: spacing.stackXs },
  meta: { ...typography.labelSm, color: colors.slateGray },
  editBtn: {
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs,
  },
  editText: { ...typography.labelMd, color: colors.primary },
});
