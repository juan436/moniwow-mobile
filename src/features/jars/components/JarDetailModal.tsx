/**
 * JarDetailModal — Component
 *
 * @what     Modal de detalle de jarra: header ícono+nombre+monto en una sola fila (antes el monto
 *           vivía debajo como hero, descuadraba el modal), badge Blindado, progreso/breakdown
 *           compacto y preview de últimos 3 movimientos (solo texto, sin ícono por fila).
 * @receives 5 props: item, transactions, onClose, onTransfer?, onEdit?
 * @processes Filtra transactions por jarId, muestra hasta 3. Un solo divisor (antes de
 *           movimientos) — progreso/breakdown viven en un bloque `surfaceContainerLow` en vez de
 *           separarse con líneas, para verse compacto y de una sola pieza (menos "cortado en
 *           pedazos" que la versión anterior). El progreso es "presupuesto usado" (no meta de
 *           ahorro) — Hogar y categorías personalizadas con monto objetivo son límites de gasto,
 *           llegar a 100% es alerta (barra pasa a alertOrange desde 90%), no logro. Distinto de
 *           GoalsJarModal, que sí es ahorro real. Últimos movimientos sin ícono por fila (se quitó
 *           el círculo de MaterialIcons — mezclaba dos lenguajes visuales de ícono en un mismo
 *           modal chico, uno para la jarra y otro por transacción, se sentía inconsistente) y con
 *           un poco más de aire vertical entre filas. onTransfer/onEdit opcionales — dashboard/ no
 *           los pasa (solo lectura), JarsScreen sí.
 * @returns  JSX — Modal fade centrado, sin scroll anidado.
 * @props    5: item, transactions, onClose, onTransfer?, onEdit?
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes, shadows } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { truncateLabel } from '@shared/utils';
import type { JarDisplay } from '../types';
import type { TransactionDisplay } from '@features/transactions/types';

function handlePopupPress() {}

type Props = {
  item: JarDisplay | null;
  transactions: TransactionDisplay[];
  onClose: () => void;
  onTransfer?: () => void;
  onEdit?: () => void;
};

export function JarDetailModal({ item, transactions, onClose, onTransfer, onEdit }: Props) {
  const insets = useSafeAreaInsets();
  const preview = item ? transactions.filter((t) => t.jarId === item.id).slice(0, 3) : [];

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: item?.iconBg }]}>
              {item?.emoji
                ? <Text style={styles.emoji}>{item.emoji}</Text>
                : item?.iconName && <MaterialIcons name={item.iconName} size={20} color={item.iconColor} />
              }
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.jarName} numberOfLines={1}>{item?.name}</Text>
              {item?.isBlindado && (
                <View style={styles.chip}>
                  <Text style={styles.chipLabel}>Blindado</Text>
                </View>
              )}
            </View>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
          </View>

          {item?.progress !== undefined && (
            <View style={styles.progressBlock}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.progress}%` as `${number}%`, backgroundColor: item.progress >= 90 ? colors.alertOrange : item.iconColor }]} />
              </View>
              <View style={styles.progressFooter}>
                <Text style={styles.progressLabel}>{item.progress}% del presupuesto usado</Text>
                {item.targetAmount !== undefined && (
                  <Text style={styles.progressLabel}>
                    $ {item.targetAmount.toLocaleString('es')} presupuesto · <Text style={styles.restColor}>$ {(item.targetAmount - item.balance).toLocaleString('es')} disponible</Text>
                  </Text>
                )}
              </View>
            </View>
          )}

          {preview.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Últimos movimientos</Text>
              <View style={styles.txList}>
                {preview.map((tx) => (
                  <View key={tx.id} style={styles.txRow}>
                    <Text style={styles.txDesc} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(tx.description)}</Text>
                    <Text style={[styles.txAmount, tx.isIncome && styles.txAmountIncome]}>
                      {tx.isIncome ? '+' : '-'}$ {tx.amount.toLocaleString('es')}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {onTransfer && <MoniButton label="Transferir" onPress={onTransfer} variant="secondary" size="sm" />}
          {onEdit && <MoniButton label="Editar jarra" onPress={onEdit} size="sm" />}

        </Pressable>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:    { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackSm, ...shadows.modal },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  iconBox:  { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emoji:    { fontSize: sizes.emojiFontMd },
  headerInfo: { flex: 1, gap: spacing.stackXxs, alignItems: 'flex-start' },
  jarName:  { ...typography.bodyMdBold, color: colors.navyDark },
  chip:     { paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, borderRadius: radius.full, backgroundColor: colors.goldTint },
  chipLabel: { ...typography.labelXs, color: colors.goldDreams },
  amount:   { ...typography.headlineMd, color: colors.navyDark, flexShrink: 0 },
  progressBlock: { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.gutter, gap: spacing.stackXs },
  barTrack: { height: sizes.trackXs, width: '100%', backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: radius.full },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.stackXs },
  progressLabel: { ...typography.labelSm, color: colors.slateGray },
  restColor: { color: colors.alertOrange },
  divider:  { height: 1, backgroundColor: colors.surfaceContainerLow },
  sectionLabel: { ...typography.labelXs, color: colors.slateGray },
  txList:    { gap: spacing.stackSm },
  txRow:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackXxs },
  txDesc:    { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  txAmount:  { ...typography.bodyMdBold, color: colors.alertOrange },
  txAmountIncome: { color: colors.emeraldSuccess },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
