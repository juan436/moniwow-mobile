/**
 * TransactionDetailModal — Component
 *
 * @what     Modal de detalle: monto héroe arriba, chip categoría y descripción abajo.
 * @receives 2 props: item, onClose
 * @processes Calcula color, prefijo y etiqueta tipo por isIncome.
 * @returns  JSX — Modal fade con backdrop y layout monto-primero.
 * @props    2: item, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import type { TransactionDisplay } from '../../types';

function stopPropagation() { return true; }

type Props = {
  item: TransactionDisplay | null;
  onClose: () => void;
};

export function TransactionDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const isIncome    = item?.isIncome ?? false;
  const amountStyle = isIncome ? styles.amountIncome : styles.amountExpense;
  const dotStyle    = isIncome ? styles.dotIncome    : styles.dotExpense;
  const prefix      = isIncome ? '+' : '-';
  const typeLabel   = isIncome ? 'Ingreso' : 'Gasto';

  const hasItems = !isIncome && (item?.items?.length ?? 0) > 0;

  function handleVerDetalle() {
    onClose();
    router.push({ pathname: '/transaction/[id]', params: { id: item?.id ?? '' } });
  }

  const labelParts    = item?.categoryLabel.split(' ') ?? [];
  const categoryEmoji = labelParts[labelParts.length - 1] ?? '';
  const categoryText  = labelParts.slice(0, -1).join(' ');

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.popup} onStartShouldSetResponder={stopPropagation}>

          <View style={styles.metaZone}>
            <View style={styles.typeRow}>
              <View style={[styles.dot, dotStyle]} />
              <Text style={styles.typeLabel}>{typeLabel}</Text>
            </View>
            {item && (
              <View style={[styles.chip, { backgroundColor: item.iconBg + '33' }]}>
                <Text style={[styles.chipLabel, { color: item.iconColor }]}>{categoryText}</Text>
                <Text style={styles.chipEmoji}>{categoryEmoji}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.amountZone}>
            <Text
              style={[styles.amount, amountStyle]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {prefix}${item?.amount.toFixed(2)}
            </Text>
            <Text style={styles.time}>{item?.time}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.descZone}>
            {item && (
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <MaterialIcons name={item.iconName} size={20} color={item.iconColor} />
              </View>
            )}
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {item?.description}
            </Text>
          </View>

          {hasItems && (
            <Pressable style={[styles.detalleBtn, { backgroundColor: item!.iconBg }]} onPress={handleVerDetalle}>
              <Text style={[styles.chipLabel, { color: item!.iconColor }]}>Ver detalle</Text>
            </Pressable>
          )}

        </View>
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
  },
  dotIncome:  { backgroundColor: colors.emeraldSuccess },
  dotExpense: { backgroundColor: colors.alertOrange },
  typeLabel: {
    ...typography.labelMd,
    color: colors.slateGray,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackXs,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackXs,
    borderRadius: radius.full,
  },
  chipLabel: {
    ...typography.labelSm,
  },
  chipEmoji: {
    fontSize: typography.labelSm.fontSize,
    lineHeight: typography.labelSm.lineHeight,
  },
  amountZone: {
    alignItems: 'center',
    gap: spacing.stackXs,
    paddingVertical: spacing.stackSm,
  },
  amount: {
    ...typography.headlineLg,
    textAlign: 'center',
  },
  amountIncome:  { color: colors.emeraldSuccess },
  amountExpense: { color: colors.alertOrange },
  time: {
    ...typography.labelSm,
    color: colors.slateGray,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerLow,
  },
  descZone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
  },
  iconCircle: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  description: {
    ...typography.bodyMd,
    color: colors.navyDark,
    flex: 1,
  },
  detalleBtn: {
    borderRadius: radius.full,
    paddingVertical: spacing.stackMd,
    alignItems: 'center',
  },
  navBarCover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
  },
});
