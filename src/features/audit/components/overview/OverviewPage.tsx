/**
 * OverviewPage — Component
 *
 * @what     Página izquierda del carrusel: balance mensual, fugas y distribución del gasto.
 * @receives 1 prop: data
 * @processes Todo DERIVADO del libro (C6 cerrado, ya no hay mocks). **Fugas es interino**: una fila
 *           por gasto de Libre del mes, ordenados por monto — sin agrupar. Agrupar por categoría
 *           ("café", "delivery") exige que la IA etiquete cada gasto (M09); inventar la categoría
 *           aquí sería mentir. Por eso cada fila lleva su fecha y NO dice "/mes": es un gasto, no un
 *           hábito. La distribución tiene un solo eje: la jarra.
 * @returns  JSX — ScrollView con MonthlyBalanceCard + fugas + distribución.
 * @props    1: data
 */
import { useState, useCallback } from 'react';
import { View, Text, Animated, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import { PageIndicator } from '@shared/components';
import { LeakDetailModal } from './LeakDetailModal';
import { MonthlyBalanceCard } from './MonthlyBalanceCard';
import type { BarChartEntry, LeakDisplay, DistributionEntry } from '../../types';

type Data = {
  barChart: BarChartEntry[];
  fugas: LeakDisplay[];
  distribution: DistributionEntry[];
  selectedMonth: string;
  onSelectMonth: (key: string) => void;
};
type Indicator = { count: number; active: number };
type Props = { data: Data; indicator: Indicator; scrollY: Animated.Value; topOffset: number };

export function OverviewPage({ data, indicator, scrollY, topOffset }: Props) {
  const { barChart, fugas, distribution, selectedMonth, onSelectMonth } = data;
  const [selectedFuga, setSelectedFuga]     = useState<LeakDisplay | null>(null);
  const handleFugaLongPress  = useCallback((fuga: LeakDisplay) => setSelectedFuga(fuga), []);
  const handleFugaModalClose = useCallback(() => setSelectedFuga(null), []);

  return (
    <Animated.ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    >
      <PageIndicator count={indicator.count} active={indicator.active} />

      <MonthlyBalanceCard barChart={barChart} selectedMonth={selectedMonth} onSelectMonth={onSelectMonth} />

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardLabel}>Fugas del mes</Text>
        {fugas.length === 0 && (
          <Text style={styles.empty}>Ni una fuga este mes. Bien ahí.</Text>
        )}
        {fugas.map((fuga, i) => (
          <Pressable key={fuga.id} style={[styles.fugaRow, i < fugas.length - 1 && styles.fugaBorder]} onLongPress={() => handleFugaLongPress(fuga)} delayLongPress={400}>
            <View style={styles.fugaIcon}>
              <MaterialIcons name={fuga.iconName} size={20} color={colors.secondary} />
            </View>
            <View style={styles.fugaInfo}>
              <Text style={styles.fugaName} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(fuga.name)}</Text>
              <Text style={styles.fugaDate}>{fuga.date}</Text>
            </View>
            <Text style={styles.fugaAmount}>-$ {fuga.amount.toLocaleString('es')}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardLabel}>Distribución del gasto</Text>
        {distribution.length === 0 && (
          <Text style={styles.empty}>Sin gastos registrados este mes.</Text>
        )}
        {distribution.map((item) => (
          <View key={item.id} style={styles.distRow}>
            <View style={styles.distLabelRow}>
              <View style={[styles.distDot, { backgroundColor: item.color }]} />
              <Text style={styles.distLabel}>{item.label}</Text>
              <Text style={styles.distPct}>{item.pct}%</Text>
            </View>
            <View style={styles.distTrack}>
              <View style={[styles.distFill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        ))}
      </View>
      <LeakDetailModal item={selectedFuga} onClose={handleFugaModalClose} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  card:     { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm },
  cardLabel: { ...typography.bodyMdBold, color: colors.navyDark },
  empty:     { ...typography.bodyMd, color: colors.slateGray, paddingVertical: spacing.stackSm },
  fugaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  fugaBorder: { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '33' },
  fugaIcon: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer + '4D', alignItems: 'center', justifyContent: 'center',
  },
  fugaInfo: { flex: 1, gap: 2 },
  fugaName: { ...typography.labelMd, color: colors.onBackground },
  fugaDate: { ...typography.labelXs, color: colors.slateGray },
  fugaAmount: { ...typography.labelMd, color: colors.alertOrange },
  distRow: { gap: spacing.stackXs },
  distLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  distDot: { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full },
  distLabel: { ...typography.labelMd, color: colors.navyDark, flex: 1 },
  distPct: { ...typography.labelMd, color: colors.slateGray },
  distTrack: { height: sizes.trackXs, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: radius.full },
});
