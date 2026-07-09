/**
 * JarsListHeader — Component
 *
 * @what     Header de contenido de JarsScreen: card resumen de saldo total + botón Añadir + título de
 *           sección. Content-first: la pantalla NO lleva barra global (logo/campanita/avatar vive solo
 *           en Dashboard) ni back — la summaryCard es el hero que identifica la pantalla.
 * @receives 3 props: total, count, onCreate
 * @processes Ninguno — presentación pura. Botón "Añadir" vive en la summaryCard (MoniButton
 *           estandarizado) — mismo patrón que GoalsSummaryCard.
 * @returns  JSX — Fragment: summaryCard + sectionTitle.
 * @props    3: total, count, onCreate
 */
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { MoniButton } from '@shared/components';

type Props = {
  total: number;
  count: number;
  onCreate: () => void;
};

export function JarsListHeader({ total, count, onCreate }: Props) {
  return (
    <>
      <View style={[styles.summaryCard, shadows.card]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryIconWrap}>
            <MaterialIcons name="account-balance-wallet" size={20} color={colors.emeraldSuccess} />
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{count} activas</Text>
          </View>
        </View>
        <View style={styles.summaryBottomRow}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Saldo total en jarras</Text>
            <Text style={styles.summaryAmount}>$ {total.toLocaleString('es')}</Text>
          </View>
          <View style={styles.summaryBtnWrap}>
            <MoniButton label="Añadir" onPress={onCreate} size="sm" />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Todas las jarras</Text>
    </>
  );
}

const styles = StyleSheet.create({
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
  summaryBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLeft:   { flex: 1, marginRight: spacing.stackMd },
  summaryBtnWrap: { flexShrink: 0 },
  summaryLabel:  { ...typography.labelMd, color: colors.slateGray },
  summaryAmount: { ...typography.headlineLg, color: colors.navyDark },
  sectionTitle:  { ...typography.bodyMdBold, color: colors.navyDark, marginBottom: spacing.stackSm },
});
