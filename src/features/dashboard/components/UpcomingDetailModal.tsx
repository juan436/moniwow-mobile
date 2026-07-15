/**
 * UpcomingDetailModal — Component
 *
 * @what     Modal de detalle de vencimiento: monto héroe, chip urgencia y nombre.
 * @receives 2 props: item, onClose
 * @processes Color según `item.isUrgent` — el dato, no la frase (parsear `urgency` pintaba de alerta
 *           todo lo que empezara por "En 1": 12, 15 y 19 días incluidos).
 * @returns  JSX — Modal fade con backdrop y layout monto-primero.
 * @props    2: item, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import type { UpcomingExpense } from '../types';

function stopPropagation() { return true; }

type Props = {
  item: UpcomingExpense | null;
  onClose: () => void;
};

export function UpcomingDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const isUrgent = item?.isUrgent ?? false;
  const isIncome = item?.isIncome ?? false;
  const color     = isUrgent ? colors.alertOrange : isIncome ? colors.emeraldSuccess : colors.primary;
  const typeLabel = isIncome ? 'Ingreso previsto' : 'Vencimiento';
  const prefix    = isIncome ? '+' : '-';

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.popup} onStartShouldSetResponder={stopPropagation}>

          <View style={styles.metaZone}>
            <View style={styles.typeRow}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={styles.typeLabel}>{typeLabel}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: color + '1A' }]}>
              <Text style={[styles.chipLabel, { color }]}>{item?.urgency}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountZone}>
            <Text style={[styles.amount, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {prefix}$ {item?.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.descZone}>
            {item && (
              <View style={[styles.iconCircle, { backgroundColor: color + '1A' }]}>
                <MaterialIcons name={item.iconName} size={20} color={color} />
              </View>
            )}
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item?.name}</Text>
          </View>

        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:   { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:      { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  metaZone:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  dot:        { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full },
  typeLabel:  { ...typography.labelMd, color: colors.slateGray },
  chip:       { paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackXs, borderRadius: radius.full },
  chipLabel:  { ...typography.labelSm },
  divider:    { height: 1, backgroundColor: colors.surfaceContainerLow },
  amountZone: { alignItems: 'center', gap: spacing.stackXs, paddingVertical: spacing.stackSm },
  amount:     { ...typography.headlineLg, textAlign: 'center' },
  descZone:   { flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd },
  iconCircle: { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  description: { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
