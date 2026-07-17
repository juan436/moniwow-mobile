/**
 * UpcomingDetailModal — Component
 *
 * @what     Modal de detalle de vencimiento: monto héroe, chip urgencia y nombre.
 * @receives 2 props: item, onClose
 * @processes Color según `item.isUrgent` — el dato, no la frase (parsear `urgency` pintaba de alerta
 *           todo lo que empezara por "En 1": 12, 15 y 19 días incluidos).
 * @returns  JSX — sheet con layout monto-primero.
 * @props    2: item, onClose
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { MoniSheet } from '@shared/components';
import type { UpcomingExpense } from '../types';

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
    <MoniSheet visible={item !== null} onClose={onClose}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

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
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:       { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackMd },
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
});
