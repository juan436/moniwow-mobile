/**
 * JarDetailModal — Component
 *
 * @what     Modal de detalle de jarra: ícono/emoji, monto héroe, barra de progreso + breakdown
 *           meta/restante si tiene targetAmount, preview de últimos movimientos de esa jarra.
 * @receives 3 props: item, transactions, onClose
 * @processes Layout monto-primero, mismo patrón que LeakDetailModal/DebtDetailModal/GoalDetailModal.
 *           Filtra transactions por jarId, muestra hasta 3 (igual que preview de LeakDetailModal).
 * @returns  JSX — Modal fade centrado, sin scroll anidado.
 * @props    3: item, transactions, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import type { JarDisplay } from '../types';
import type { TransactionDisplay } from '@features/transactions/types';

function handlePopupPress() {}

type Props = {
  item: JarDisplay | null;
  transactions: TransactionDisplay[];
  onClose: () => void;
};

export function JarDetailModal({ item, transactions, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const preview = item ? transactions.filter((t) => t.jarId === item.id).slice(0, 3) : [];

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <View style={styles.metaZone}>
            <View style={[styles.iconBox, { backgroundColor: item?.iconBg }]}>
              {item?.emoji
                ? <Text style={styles.emoji}>{item.emoji}</Text>
                : item?.iconName && <MaterialIcons name={item.iconName} size={22} color={item.iconColor} />
              }
            </View>
            {item?.isBlindado && (
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>Blindado</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.amountZone}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
            <Text style={styles.jarName} numberOfLines={1}>{item?.name}</Text>
          </View>

          {item?.progress !== undefined && (
            <>
              <View style={styles.divider} />
              <View style={styles.progressZone}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.progress}%` as `${number}%`, backgroundColor: item.iconColor }]} />
                </View>
                <Text style={styles.progressLabel}>{item.progress}% del objetivo</Text>
              </View>
              {item.targetAmount !== undefined && (
                <View style={styles.breakdown}>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>Meta</Text>
                    <Text style={styles.breakdownValue}>$ {item.targetAmount.toLocaleString('es')}</Text>
                  </View>
                  <View style={styles.breakdownSep} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>Restante</Text>
                    <Text style={[styles.breakdownValue, styles.restColor]}>
                      $ {(item.targetAmount - item.balance).toLocaleString('es')}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {preview.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.txList}>
                {preview.map((tx, i) => (
                  <View key={tx.id}>
                    <View style={styles.txRow}>
                      <Text style={styles.txDesc} numberOfLines={1} ellipsizeMode="tail">{tx.description}</Text>
                      <Text style={[styles.txAmount, tx.isIncome && styles.txAmountIncome]}>
                        {tx.isIncome ? '+' : '-'}$ {tx.amount.toLocaleString('es')}
                      </Text>
                    </View>
                    {i < preview.length - 1 && <View style={styles.txSep} />}
                  </View>
                ))}
              </View>
            </>
          )}

        </Pressable>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:    { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  metaZone: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBox:  { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: sizes.emojiFontMd },
  chip:     { paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackXs, borderRadius: radius.full, backgroundColor: colors.goldTint },
  chipLabel: { ...typography.labelSm, color: colors.goldDreams },
  divider:  { height: 1, backgroundColor: colors.surfaceContainerLow },
  amountZone: { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  amount:   { ...typography.headlineLg, color: colors.navyDark, textAlign: 'center' },
  jarName:  { ...typography.labelMd, color: colors.slateGray, textAlign: 'center' },
  progressZone: { gap: spacing.stackXs },
  barTrack: { height: sizes.trackSm, width: '100%', backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: radius.full },
  progressLabel: { ...typography.labelSm, color: colors.slateGray, textAlign: 'center' },
  breakdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  breakdownItem: { flex: 1, alignItems: 'center', gap: spacing.stackXs },
  breakdownSep:  { width: 1, height: 32, backgroundColor: colors.surfaceContainerLow },
  breakdownLabel: { ...typography.labelSm, color: colors.slateGray },
  breakdownValue: { ...typography.labelMd, color: colors.navyDark },
  restColor: { color: colors.alertOrange },
  txList:    { gap: spacing.stackSm },
  txRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.stackMd, paddingVertical: spacing.stackXs },
  txDesc:    { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  txAmount:  { ...typography.labelMd, color: colors.alertOrange },
  txAmountIncome: { color: colors.emeraldSuccess },
  txSep:     { height: 1, backgroundColor: colors.surfaceContainerLow },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
