/**
 * GoalDetailModal — Component
 *
 * @what     Modal de detalle de sueño: meta héroe, barra progreso, desglose ahorro/restante y emoji.
 * @receives 2 props: item, onClose
 * @processes Calcula restante desde item.target - item.current.
 * @returns  JSX — Modal fade con layout monto-primero alineado a TransactionDetailModal.
 * @props    2: item, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import type { GoalDisplay } from '../../types';

type Props = {
  item: GoalDisplay | null;
  onClose: () => void;
};

function handlePopupPress() {}

export function GoalDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const restante = item ? item.target - item.current : 0;
  const progress = item?.progress ?? 0;

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <View style={styles.metaZone}>
            <View style={styles.typeRow}>
              <View style={styles.dot} />
              <Text style={styles.typeLabel}>Sueño</Text>
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

        </Pressable>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: `${colors.navyDark}8C`,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.marginPage,
  },
  popup: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    width: '100%',
    padding: spacing.cardPadding,
    gap: spacing.stackMd,
    ...shadows.modal,
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
  navBarCover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
  },
});
