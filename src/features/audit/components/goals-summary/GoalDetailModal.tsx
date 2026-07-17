/**
 * GoalDetailModal — Component
 *
 * @what     Modal de detalle de meta: meta héroe, barra progreso, desglose ahorro/restante y emoji.
 * @receives 2 props: item, onClose
 * @processes Calcula restante desde item.target - item.current.
 * @returns  JSX — sheet con layout monto-primero alineado a TransactionDetailModal.
 * @props    2: item, onClose
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { MoniSheet } from '@shared/components';
import type { GoalDisplay } from '../../types';

type Props = {
  item: GoalDisplay | null;
  onClose: () => void;
};

export function GoalDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const restante = item ? item.target - item.current : 0;
  const progress = item?.progress ?? 0;

  return (
    <MoniSheet visible={item !== null} onClose={onClose}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

          <View style={styles.metaZone}>
            <View style={styles.typeRow}>
              <View style={styles.dot} />
              <Text style={styles.typeLabel}>Meta</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>{progress}% completado</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountZone}>
            <Text
              style={styles.total}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              $ {item?.target.toLocaleString('es')}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progress}%` as `${number}%` }]} />
            </View>
            <View style={styles.breakdown}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Ahorro</Text>
                <Text style={[styles.breakdownValue, styles.savedColor]}>$ {item?.current.toLocaleString('es')}</Text>
              </View>
              <View style={styles.breakdownSep} />
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Restante</Text>
                <Text style={[styles.breakdownValue, styles.restColor]}>$ {restante.toLocaleString('es')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.goalName} numberOfLines={2} ellipsizeMode="tail">
            {item?.name}
          </Text>

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.cardPadding,
    paddingTop: spacing.stackSm,
    gap: spacing.stackMd,
  },
  metaZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
  },
  dot: {
    width: sizes.dotSm,
    height: sizes.dotSm,
    borderRadius: radius.full,
    backgroundColor: colors.goldDreams,
  },
  typeLabel: {
    ...typography.labelMd,
    color: colors.slateGray,
  },
  chip: {
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackXs,
    borderRadius: radius.full,
    backgroundColor: colors.goldDreams + '33',
  },
  chipLabel: {
    ...typography.labelSm,
    color: colors.goldDreams,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerLow,
  },
  amountZone: {
    alignItems: 'center',
    gap: spacing.stackSm,
    paddingVertical: spacing.stackSm,
  },
  total: {
    ...typography.headlineLg,
    color: colors.goldDreams,
    textAlign: 'center',
  },
  barTrack: {
    height: sizes.trackSm,
    width: '100%',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.goldDreams,
    borderRadius: radius.full,
  },
  breakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.stackXs,
  },
  breakdownSep: {
    width: 1,
    height: 32,
    backgroundColor: colors.surfaceContainerLow,
  },
  breakdownLabel: {
    ...typography.labelSm,
    color: colors.slateGray,
  },
  breakdownValue: {
    ...typography.labelMd,
  },
  savedColor: { color: colors.emeraldSuccess },
  restColor:  { color: colors.alertOrange },
  goalName: {
    ...typography.bodyMd,
    color: colors.navyDark,
    textAlign: 'center',
  },
});
