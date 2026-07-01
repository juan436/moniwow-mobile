/**
 * MundoParaleloPage — Component
 *
 * @what     Página del carrusel: patrimonio real + deuda total con donut y barras.
 * @receives 1 prop: data
 * @processes Renderiza card patrimonio + DeudaCard con visualización SVG.
 * @returns  JSX — ScrollView vertical con 2 cards.
 * @props    1: data
 */
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { PageIndicator } from '@shared/components';
import type { DebtBreakdown } from '../../types';
import { DeudaCard } from './DeudaCard';

type Data = {
  patrimonio: number;
  deudaTotal: number;
  deudaPagada: number;
  deudaBreakdown: DebtBreakdown[];
};

type Indicator = { count: number; active: number };
type Props = { data: Data; indicator: Indicator; scrollY: Animated.Value; topOffset: number };

export function MundoParaleloPage({ data, indicator, scrollY, topOffset }: Props) {
  const { patrimonio, deudaTotal, deudaPagada, deudaBreakdown } = data;
  const dineroTotal = patrimonio + deudaTotal;
  const isPositive = patrimonio >= 0;

  return (
    <Animated.ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    >
      <PageIndicator count={indicator.count} active={indicator.active} />

      <View style={[styles.card, styles.heroCard, shadows.card]}>
        <View style={styles.accentBar} />
        <View style={styles.headerRow}>
          <Text style={styles.cardLabel}>Tu patrimonio real</Text>
          <View style={styles.saludBadge}>
            <MaterialIcons name="verified-user" size={11} color={colors.emeraldSuccess} />
            <Text style={styles.saludBadgeText}>Óptimo</Text>
          </View>
        </View>

        <Text style={[styles.patrimonioAmount, !isPositive && styles.patrimonioNeg]}>
          $ {Math.abs(patrimonio).toLocaleString('es')}.00
        </Text>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Activos</Text>
            <Text style={styles.statValue}>$ {dineroTotal.toLocaleString('es')}</Text>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Deudas</Text>
            <Text style={[styles.statValue, styles.statDebt]}>− $ {deudaTotal.toLocaleString('es')}</Text>
          </View>
        </View>
      </View>

      <DeudaCard
        deudaTotal={deudaTotal}
        deudaPagada={deudaPagada}
        deudaBreakdown={deudaBreakdown}
      />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  card:      { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.gutter, gap: spacing.stackSm },
  heroCard:  { overflow: 'hidden' },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.emeraldSuccess },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { ...typography.bodyMdBold, color: colors.navyDark },
  saludBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, backgroundColor: `${colors.emeraldSuccess}1A`, paddingHorizontal: spacing.stackSm, paddingVertical: 3, borderRadius: radius.full },
  saludBadgeText: { ...typography.labelXs, color: colors.emeraldSuccess },
  patrimonioAmount: { ...typography.headlineLg, color: colors.emeraldSuccess, textAlign: 'center' },
  patrimonioNeg: { color: colors.alertOrange },
  divider: { height: 1, backgroundColor: colors.surfaceContainerLow },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: spacing.stackXs },
  statSep: { width: 1, height: 32, backgroundColor: colors.surfaceContainerLow },
  statLabel: { ...typography.labelXs, color: colors.slateGray },
  statValue: { ...typography.labelMd, color: colors.navyDark },
  statDebt: { color: colors.alertOrange },
});
