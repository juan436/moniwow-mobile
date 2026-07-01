/**
 * TransactionDetailScreen — Screen
 *
 * @what     Detalle completo de transacción: héroe de monto, ítems individuales y factura.
 * @receives id param de expo-router (transaction.id).
 * @processes Busca la transacción en useDashboard, renderiza ítems y abre factura si existe.
 * @returns  JSX — pantalla con header, ScrollView de ítems y ReceiptViewerModal.
 */
import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { useDashboard } from '@features/dashboard/hooks/useDashboard';
import { ReceiptViewerModal } from '@features/dashboard/components/ReceiptViewerModal';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useDashboard();
  const tx = transactions.find((t) => t.id === id) ?? null;
  const insets = useSafeAreaInsets();

  const isIncome   = tx?.isIncome ?? false;
  const prefix     = isIncome ? '+' : '-';
  const colorStyle = isIncome ? styles.income : styles.expense;

  const [showReceipt, setShowReceipt] = useState(false);

  function handleBack()  { router.back(); }

  return (
    <View style={styles.screen}>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
          <Pressable style={styles.backBtn} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {tx?.description ?? 'Detalle'}
          </Text>
        </View>
        <View style={[styles.heroCard, shadows.card]}>
          <Text style={styles.heroLabel}>{isIncome ? 'Total ingreso' : 'Total gasto'}</Text>
          <Text style={[styles.heroAmount, colorStyle]}>
            {prefix}${tx?.amount.toFixed(2)}
          </Text>
          <Text style={styles.heroTime}>{tx?.time}</Text>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Ítems del movimiento</Text>
          {tx?.receiptUri && !isIncome && (
            <Pressable style={styles.receiptBtn} onPress={() => setShowReceipt(true)} hitSlop={8}>
              <MaterialIcons name="receipt" size={18} color={colors.primary} />
              <Text style={styles.receiptBtnLabel}>Factura</Text>
            </Pressable>
          )}
        </View>

        {tx?.items?.map((item) => (
          <View key={item.description} style={[styles.itemCard, shadows.card]}>
            <Text style={styles.itemDesc}>{item.description}</Text>
            <Text style={[styles.itemAmount, colorStyle]}>
              {prefix}${item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.statusBarCover, { height: insets.top }]} />
      <View style={[styles.footer, { paddingBottom: insets.bottom }]} />

      {tx?.receiptUri && !isIncome && (
        <ReceiptViewerModal
          uri={tx.receiptUri}
          visible={showReceipt}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.stackMd,
    paddingRight: spacing.marginPage,
    paddingVertical: spacing.stackSm,
    gap: spacing.stackSm,
    backgroundColor: colors.pureWhite,
    marginHorizontal: -spacing.marginPage,
    ...shadows.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.navyDark,
    flex: 1,
  },
  list:        { flex: 1 },
  listContent: { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg, gap: spacing.stackSm },
  heroCard: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    alignItems: 'center',
    gap: spacing.stackXs,
  },
  heroLabel: { ...typography.labelMd, color: colors.slateGray },
  heroAmount:      { ...typography.headlineLg },
  heroTime:        { ...typography.labelSm, color: colors.slateGray },
  sectionRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.stackLg, marginBottom: spacing.stackSm },
  sectionLabel:    { ...typography.bodyMdBold, color: colors.navyDark },
  receiptBtn:      { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, padding: spacing.stackSm },
  receiptBtnLabel: { ...typography.labelMd, color: colors.primary },
  itemCard: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.stackMd,
  },
  itemDesc:   { ...typography.bodyMd, color: colors.navyDark, flex: 1 },
  itemAmount: { ...typography.labelMd },
  income:     { color: colors.emeraldSuccess },
  expense:    { color: colors.alertOrange },
  footer:         { backgroundColor: colors.pureWhite, ...shadows.footer },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
});
