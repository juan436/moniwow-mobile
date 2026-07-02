/**
 * OverviewPage — Component
 *
 * @what     Página izquierda del carrusel: análisis mensual con barras visuales y fugas.
 * @receives 1 prop: data
 * @processes Normaliza alturas de barras relativo al valor máximo.
 * @returns  JSX — ScrollView vertical con gráfica de barras y lista de fugas.
 * @props    1: data
 */
import { useState, useCallback, useMemo } from 'react';
import { View, Text, Animated, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import { PageIndicator } from '@shared/components';
import { LeakDetailModal } from './LeakDetailModal';
import type { BarChartEntry, LeakDisplay, DistributionEntry } from '../../types';

type Data = {
  barChart: BarChartEntry[];
  fugas: LeakDisplay[];
  distribution: DistributionEntry[];
};
type Indicator = { count: number; active: number };
type Props = { data: Data; indicator: Indicator; scrollY: Animated.Value; topOffset: number };

export function OverviewPage({ data, indicator, scrollY, topOffset }: Props) {
  const { barChart, fugas, distribution } = data;
  const [selectedFuga, setSelectedFuga]     = useState<LeakDisplay | null>(null);
  const handleFugaLongPress  = useCallback((fuga: LeakDisplay) => setSelectedFuga(fuga), []);
  const handleFugaModalClose = useCallback(() => setSelectedFuga(null), []);

  const maxAmount = useMemo(
    () => Math.max(...barChart.map((b) => b.amount)),
    [barChart]
  );

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
        <Text style={styles.cardLabel}>Balance mensual</Text>

        <View style={styles.barChart}>
          {barChart.map((entry) => {
            const barHeight = (entry.amount / maxAmount) * sizes.barMaxHeight;
            return (
              <View key={entry.month} style={styles.barGroup}>
                <Text style={styles.barAmount}>$ {(entry.amount / 1000).toFixed(1)}k</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: barHeight }]} />
                </View>
                <Text style={styles.barMonth}>{entry.month}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardLabel}>Tus fugas más grandes</Text>
        {fugas.map((fuga, i) => (
          <Pressable key={fuga.id} style={[styles.fugaRow, i < fugas.length - 1 && styles.fugaBorder]} onLongPress={() => handleFugaLongPress(fuga)} delayLongPress={400}>
            <View style={styles.fugaIcon}>
              <MaterialIcons name={fuga.iconName} size={20} color={colors.secondary} />
            </View>
            <Text style={styles.fugaName} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(fuga.name)}</Text>
            <Text style={styles.fugaAmount}>-$ {fuga.amount}/mes</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardLabel}>Distribución del gasto</Text>
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
  heroCard: { overflow: 'hidden' },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.emeraldSuccess },
  cardLabel: { ...typography.bodyMdBold, color: colors.navyDark },
  barChart: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.gutter,
    height: sizes.barMaxHeight + sizes.barLabelSpace,
  },
  barGroup: { flex: 1, alignItems: 'center', gap: spacing.stackXs },
  barAmount: { ...typography.labelXs, color: colors.slateGray },
  barTrack: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', height: sizes.barMaxHeight },
  bar: { width: '60%', backgroundColor: colors.emeraldSuccess, borderRadius: radius.sm },
  barMonth: { ...typography.labelXs, color: colors.slateGray },
  fugaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  fugaBorder: { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '33' },
  fugaIcon: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer + '4D', alignItems: 'center', justifyContent: 'center',
  },
  fugaName: { ...typography.labelMd, color: colors.onBackground, flex: 1 },
  fugaAmount: { ...typography.labelMd, color: colors.alertOrange },
  distRow: { gap: spacing.stackXs },
  distLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  distDot: { width: sizes.dotSm, height: sizes.dotSm, borderRadius: radius.full },
  distLabel: { ...typography.labelMd, color: colors.navyDark, flex: 1 },
  distPct: { ...typography.labelMd, color: colors.slateGray },
  distTrack: { height: sizes.trackXs, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: radius.full },
});
