/**
 * JarsListHeader — Component
 *
 * @what     Header de JarsScreen: back button + título + botón crear + card resumen de saldo total.
 * @receives 5 props: total, count, topInset, onBack, onCreate
 * @processes Ninguno — presentación pura.
 * @returns  JSX — Fragment: header row + summaryCard + sectionTitle.
 * @props    5: total, count, topInset, onBack, onCreate
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';

type Props = {
  total: number;
  count: number;
  topInset: number;
  onBack: () => void;
  onCreate: () => void;
};

export function JarsListHeader({ total, count, topInset, onBack, onCreate }: Props) {
  return (
    <>
      <View style={[styles.header, { paddingTop: topInset + spacing.stackSm }]}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Mis jarras</Text>
        <Pressable style={styles.addBtn} onPress={onCreate} hitSlop={8}>
          <MaterialIcons name="add" size={24} color={colors.emeraldSuccess} />
        </Pressable>
      </View>

      <View style={[styles.summaryCard, shadows.card]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryIconWrap}>
            <MaterialIcons name="account-balance-wallet" size={20} color={colors.emeraldSuccess} />
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{count} activas</Text>
          </View>
        </View>
        <Text style={styles.summaryLabel}>Saldo total en jarras</Text>
        <Text style={styles.summaryAmount}>$ {total.toLocaleString('es')}</Text>
      </View>

      <Text style={styles.sectionTitle}>Todas las jarras</Text>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.stackMd,
    paddingRight: spacing.marginPage,
    paddingBottom: spacing.stackSm,
    gap: spacing.stackSm,
    backgroundColor: colors.pureWhite,
    marginHorizontal: -spacing.marginPage,
    ...shadows.card,
  },
  backBtn: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.headlineMd, color: colors.navyDark, flex: 1 },
  addBtn: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.full,
    backgroundColor: colors.emeraldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    gap: spacing.stackSm,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackMd,
    borderLeftWidth: 3,
    borderLeftColor: colors.emeraldSuccess,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryIconWrap: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.lg,
    backgroundColor: colors.emeraldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPill: {
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.stackXxs,
    backgroundColor: colors.emeraldTint,
    borderRadius: radius.full,
  },
  countText:     { ...typography.labelSm, color: colors.emeraldSuccess },
  summaryLabel:  { ...typography.labelMd, color: colors.slateGray },
  summaryAmount: { ...typography.headlineLg, color: colors.navyDark },
  sectionTitle:  { ...typography.bodyMdBold, color: colors.navyDark, marginBottom: spacing.stackSm },
});
