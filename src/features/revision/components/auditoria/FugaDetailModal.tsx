/**
 * FugaDetailModal — Component
 *
 * @what     Modal de detalle de fuga: monto héroe, preview de últimos 3 movimientos y botón a pantalla completa.
 * @receives 2 props: item, onClose
 * @processes Muestra los 3 primeros items como preview. "Ver detalle" navega a /fuga/[id].
 * @returns  JSX — Modal fade con layout monto-primero sin scroll anidado.
 * @props    2: item, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import type { FugaDisplay } from '../../types';

function stopPropagation() { return true; }

type Props = {
  item: FugaDisplay | null;
  onClose: () => void;
};

export function FugaDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const preview = item?.items.slice(0, 3) ?? [];

  function handleVerDetalle() {
    onClose();
    router.push({ pathname: '/fuga/[id]', params: { id: item?.id ?? '' } });
  }

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.popup} onStartShouldSetResponder={stopPropagation}>

          <View style={styles.metaZone}>
            <View style={styles.typeRow}>
              <View style={styles.dot} />
              <Text style={styles.typeLabel}>Hormiga</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Mensual</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountZone}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              -$ {item?.amount.toLocaleString('es')} / mes
            </Text>
            <Text style={styles.categoryName} numberOfLines={1}>{item?.name}</Text>
          </View>

          <View style={styles.divider} />

          <View>
            {preview.map((tx, i) => (
              <View key={tx.description}>
                <View style={styles.txRow}>
                  <View style={styles.txLeft}>
                    <Text style={styles.txDesc} numberOfLines={1} ellipsizeMode="tail">{tx.description}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                  </View>
                  <Text style={styles.txAmount}>-$ {tx.amount.toLocaleString('es')}</Text>
                </View>
                {i < preview.length - 1 && <View style={styles.txSep} />}
              </View>
            ))}
          </View>

          <Pressable style={styles.detalleBtn} onPress={handleVerDetalle}>
            <Text style={styles.chipLabel}>Ver detalle</Text>
          </Pressable>

        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup: { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  metaZone: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  dot:      { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full, backgroundColor: colors.alertOrange },
  typeLabel: { ...typography.labelMd, color: colors.slateGray },
  chip:     { paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackXs, borderRadius: radius.full, backgroundColor: colors.alertOrange + '33' },
  chipLabel: { ...typography.labelSm, color: colors.alertOrange },
  divider:  { height: 1, backgroundColor: colors.surfaceContainerLow },
  amountZone: { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  amount:   { ...typography.headlineLg, color: colors.alertOrange, textAlign: 'center' },
  categoryName: { ...typography.labelMd, color: colors.slateGray, textAlign: 'center' },
  txRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.stackSm, gap: spacing.stackMd },
  txLeft:   { flex: 1, gap: spacing.stackXxs },
  txDesc:   { ...typography.bodyMd, color: colors.navyDark },
  txDate:   { ...typography.labelSm, color: colors.slateGray },
  txAmount: { ...typography.labelMd, color: colors.alertOrange },
  txSep:    { height: 1, backgroundColor: colors.surfaceContainerLow },
  detalleBtn: { backgroundColor: colors.alertOrange + '1A', borderRadius: radius.full, paddingVertical: spacing.stackMd, alignItems: 'center' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
