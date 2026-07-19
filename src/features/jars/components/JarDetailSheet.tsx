/**
 * JarDetailSheet — Component
 *
 * @what     Modal de detalle de jarra: header (ícono+nombre+monto), barra de nivel compacta, preview
 *           de 3 movimientos (acento + monto de color) y botón-ícono → movimientos de esta jarra.
 * @receives 6 props: item, transactions, onClose, onTransfer?, onEdit?, onRebalance?
 * @processes Filtra transactions por jarId. Progreso = NIVEL (`balance/presupuesto`, lleno=bueno,
 *           naranja ≤20%). onTransfer/onEdit opcionales; "Editar jarra" solo si hay capacidad editable.
 *           **Negativo (M03 §3)**: saldo en rojo, oculta la barra, `JarRedNudge` con "Reequilibrar".
 * @returns  JSX — sheet, sin scroll anidado.
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { MoniButton, MoniSheet } from '@shared/components';
import { truncateLabel } from '@shared/utils';
import { jarCapabilities } from '@core/entities/Jar';
import { JarRedNudge } from './JarRedNudge';
import type { JarDisplay } from '../types';
import type { TransactionDisplay } from '@features/transactions/types';

const LOW_LEVEL_PCT = 20; // Jarra casi vacía = alerta; el nivel alto es lo sano.

type Props = {
  item: JarDisplay | null;
  transactions: TransactionDisplay[];
  onClose: () => void;
  onTransfer?: () => void;
  onEdit?: () => void;
  onRebalance?: () => void;
};

export function JarDetailSheet({ item, transactions, onClose, onTransfer, onEdit, onRebalance }: Props) {
  const insets = useSafeAreaInsets();
  const preview = item ? transactions.filter((t) => t.jarId === item.id).slice(0, 3) : [];
  const caps = item ? jarCapabilities(item.type) : null;
  const canEdit = !!caps && (caps.canRename || caps.canEditBudget || caps.canToggleBlindado || caps.canDelete);

  function handleViewAll() {
    if (!item) return;
    onClose();
    router.push({ pathname: '/transactions', params: { jarId: item.id, jarName: item.name } });
  }

  return (
    <MoniSheet visible={item !== null} onClose={onClose}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

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
                  <MaterialIcons name="lock" size={12} color={colors.goldDreams} />
                  <Text style={styles.chipLabel}>Blindado</Text>
                </View>
              )}
            </View>
            <Text style={[styles.amount, item?.isNegative && styles.amountNeg]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
          </View>

          {item?.isNegative && onRebalance && <JarRedNudge deficit={Math.abs(item.balance)} onRebalance={onRebalance} />}

          {item?.progress !== undefined && !item.isNegative && (
            <View style={styles.progressBlock}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.progress}%` as `${number}%`, backgroundColor: item.progress <= LOW_LEVEL_PCT ? colors.alertOrange : item.iconColor }]} />
              </View>
              <View style={styles.progressFooter}>
                <Text style={styles.progressLabel}>Te queda el {item.progress}%</Text>
                {item.targetAmount !== undefined && (
                  <Text style={styles.progressLabel}>
                    <Text style={styles.restColor}>$ {item.balance.toLocaleString('es')}</Text> de $ {item.targetAmount.toLocaleString('es')}
                  </Text>
                )}
              </View>
            </View>
          )}

          {preview.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Últimos movimientos</Text>
                <Pressable onPress={handleViewAll} hitSlop={8} style={styles.viewAllBtn}>
                  <MaterialIcons name="arrow-forward" size={22} color={colors.primary} />
                </Pressable>
              </View>
              <View style={styles.txList}>
                {preview.map((tx) => (
                  <View key={tx.id} style={styles.txRow}>
                    <View style={[styles.accent, { backgroundColor: tx.isIncome ? colors.emeraldSuccess : colors.alertOrange }]} />
                    <View style={styles.txMain}>
                      <Text style={styles.txDesc} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(tx.description)}</Text>
                      <Text style={[styles.txAmount, tx.isIncome && styles.txAmountIncome]}>
                        {tx.isIncome ? '+' : '-'}$ {tx.amount.toLocaleString('es')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {onTransfer && <MoniButton label="Transferir" onPress={onTransfer} variant="secondary" />}
          {onEdit && canEdit && <MoniButton label="Editar jarra" onPress={onEdit} />}

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:      { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackSm },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  iconBox:   { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emoji:     { fontSize: sizes.emojiFontMd },
  headerInfo: { flex: 1, gap: spacing.stackXxs, alignItems: 'flex-start' },
  jarName:   { ...typography.bodyMdBold, color: colors.navyDark },
  chip:      { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXxs, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXxs, borderRadius: radius.full, backgroundColor: colors.goldTint },
  chipLabel: { ...typography.labelXs, color: colors.goldDreams },
  amount:    { ...typography.headlineMd, color: colors.navyDark, flexShrink: 0 },
  amountNeg: { color: colors.error },
  progressBlock: { backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: spacing.stackSm, gap: spacing.stackXs },
  barTrack:  { height: sizes.trackXs, width: '100%', backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  barFill:   { height: '100%', borderRadius: radius.full },
  progressFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.stackSm },
  progressLabel: { ...typography.labelXs, color: colors.slateGray },
  restColor: { color: colors.navyDark },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { ...typography.labelXs, color: colors.slateGray },
  viewAllBtn: { width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  txList:    { gap: spacing.stackXs },
  txRow:     { flexDirection: 'row', alignItems: 'stretch', backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, overflow: 'hidden' },
  accent:    { width: 3 },
  txMain:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.stackSm, paddingVertical: spacing.stackSm, paddingHorizontal: spacing.stackSm },
  txDesc:    { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  txAmount:  { ...typography.bodyMdBold, color: colors.alertOrange },
  txAmountIncome: { color: colors.emeraldSuccess },
});
