/**
 * JarDetailModal — Component
 *
 * @what     Modal de detalle de jarra: ícono/emoji, monto héroe, barra de progreso si aplica.
 * @receives 2 props: item, onClose
 * @processes Layout monto-primero, mismo patrón que LeakDetailModal/DebtDetailModal/GoalDetailModal.
 * @returns  JSX — Modal fade centrado, sin scroll anidado.
 * @props    2: item, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import type { JarDisplay } from '../types';

function handlePopupPress() {}

type Props = {
  item: JarDisplay | null;
  onClose: () => void;
};

export function JarDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();

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
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
