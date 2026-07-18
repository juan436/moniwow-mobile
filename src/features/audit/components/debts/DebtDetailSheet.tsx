/**
 * DebtDetailSheet — Component
 *
 * @what     Modal de detalle de deuda: monto total héroe, barra progreso y desglose pagado/restante.
 * @receives 3 props: item, color, onClose
 * @processes Calcula pagado y restante desde item.amount + item.progress.
 * @returns  JSX — sheet con layout monto-primero.
 * @props    3: item, color, onClose
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { MoniSheet } from '@shared/components';
import type { DebtBreakdown } from '../../types';

type Props = {
  item: DebtBreakdown | null;
  color: string;
  onClose: () => void;
};

export function DebtDetailSheet({ item, color, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const pagado   = item ? Math.round(item.amount * item.progress / 100) : 0;
  const restante = item ? item.amount - pagado : 0;
  const progress = item?.progress ?? 0;

  return (
    <MoniSheet visible={item !== null} onClose={onClose}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

          <View style={styles.metaZone}>
            <View style={styles.typeRow}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={styles.typeLabel}>Deuda</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: color + '33' }]}>
              <Text style={[styles.chipLabel, { color }]}>{progress}% pagado</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountZone}>
            <Text style={[styles.total, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.amount.toLocaleString('es')}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progress}%` as `${number}%`, backgroundColor: color }]} />
            </View>
            <View style={styles.breakdown}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Pagado</Text>
                <Text style={[styles.breakdownValue, styles.paidColor]}>$ {pagado.toLocaleString('es')}</Text>
              </View>
              <View style={styles.breakdownSep} />
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Restante</Text>
                <Text style={[styles.breakdownValue, styles.restColor]}>$ {restante.toLocaleString('es')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.debtName} numberOfLines={2} ellipsizeMode="tail">{item?.label}</Text>

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:     { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackMd },
  metaZone: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  dot:      { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full },
  typeLabel: { ...typography.labelMd, color: colors.slateGray },
  chip:     { paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackXs, borderRadius: radius.full },
  chipLabel: { ...typography.labelSm },
  divider:  { height: 1, backgroundColor: colors.surfaceContainerLow },
  amountZone: { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  total:    { ...typography.headlineLg, textAlign: 'center' },
  barTrack: { height: sizes.trackSm, width: '100%', backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: radius.full },
  breakdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  breakdownItem: { flex: 1, alignItems: 'center', gap: spacing.stackXs },
  breakdownSep:  { width: 1, height: 32, backgroundColor: colors.surfaceContainerLow },
  breakdownLabel: { ...typography.labelSm, color: colors.slateGray },
  breakdownValue: { ...typography.labelMd },
  paidColor: { color: colors.emeraldSuccess },
  restColor: { color: colors.alertOrange },
  debtName:  { ...typography.bodyMd, color: colors.navyDark, textAlign: 'center' },
});
