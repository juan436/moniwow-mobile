/**
 * GoalsSummaryPage — Component
 *
 * @what     Página extrema derecha del carrusel: progreso global de metas activas.
 * @receives 1 prop: data
 * @processes Renderiza card de progreso total y lista de goal cards con barras.
 * @returns  JSX — ScrollView vertical.
 * @props    1: data
 */
import { useState, useCallback, useMemo } from 'react';
import { View, Text, Animated, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import { PageIndicator } from '@shared/components';
import { GoalDetailSheet } from './GoalDetailSheet';
import type { GoalDisplay } from '../../types';

type Data = {
  goalProgress: number;
  goalsTotal: number;
  metaGlobal: number;
  goals: GoalDisplay[];
};

type Indicator = { count: number; active: number };
type Props = { data: Data; indicator: Indicator; scrollY: Animated.Value; topOffset: number };

export function GoalsSummaryPage({ data, indicator, scrollY, topOffset }: Props) {
  const { goalProgress, goalsTotal, metaGlobal, goals } = data;

  const [selectedGoal, setSelectedGoal]     = useState<GoalDisplay | null>(null);
  const handleGoalLongPress  = useCallback((goal: GoalDisplay) => setSelectedGoal(goal), []);
  const handleGoalModalClose = useCallback(() => setSelectedGoal(null), []);
  const progressFillStyle = useMemo(
    () => [styles.progressFill, { width: `${goalProgress}%` as `${number}%` }],
    [goalProgress]
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

      <View style={[styles.card, styles.heroCard, styles.cardPadded, shadows.card]}>
        <View style={styles.accentBar} />
        <Text style={styles.progresoTitle}>Progreso Total de Metas</Text>
        <View style={styles.progresoHeader}>
          <Text style={styles.progresoSub}>Vas por muy buen camino</Text>
          <Text style={styles.progresoPct}>{goalProgress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={progressFillStyle} />
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total en Metas</Text>
            <Text style={styles.statValue}>$ {goalsTotal.toLocaleString('es')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Meta global</Text>
            <Text style={styles.statValue}>$ {metaGlobal.toLocaleString('es')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Metas Activas</Text>
          <Pressable hitSlop={8} onPress={() => router.push('/goals')}><Text style={styles.sectionLink}>Ver todos</Text></Pressable>
        </View>
        {goals.map((goal) => (
          <Pressable key={goal.id} style={[styles.goalCard, shadows.card]} onLongPress={() => handleGoalLongPress(goal)} delayLongPress={400}>
            <View style={styles.goalTop}>
              <View style={styles.goalLeft}>
                <View style={styles.goalEmoji}>
                  <Text style={styles.goalEmojiText}>{goal.emoji}</Text>
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(goal.name)}</Text>
                  <Text style={styles.goalPct}>{goal.progress}% completado</Text>
                </View>
              </View>
              <View style={styles.goalRight}>
                <Text style={styles.goalCurrent}>$ {goal.current.toLocaleString('es')}</Text>
                <Text style={styles.goalTarget}>de $ {goal.target.toLocaleString('es')}</Text>
              </View>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${goal.progress}%` }]} />
            </View>
          </Pressable>
        ))}
      </View>
      <GoalDetailSheet item={selectedGoal} onClose={handleGoalModalClose} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  card:       { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm },
  cardPadded: { paddingTop: spacing.stackLg },
  heroCard:   { overflow: 'hidden' },
  accentBar:  { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.emeraldSuccess },
  progresoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  progresoTitle: { ...typography.bodyMdBold, color: colors.navyDark, marginBottom: -spacing.stackMd },
  progresoSub: { ...typography.labelMd, color: colors.slateGray },
  progresoPct: { ...typography.headlineMd, color: colors.emeraldSuccess },
  progressTrack: { height: sizes.trackMd, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.emeraldSuccess, borderRadius: radius.full },
  statsGrid: { flexDirection: 'row', gap: spacing.stackMd },
  statBox: {
    flex: 1, backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md, padding: spacing.gutter, gap: spacing.stackXs,
  },
  statLabel: { ...typography.labelXs, color: colors.slateGray },
  statValue: { ...typography.bodyLg, color: colors.navyDark },
  section: { gap: spacing.stackMd },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.bodyMdBold, color: colors.navyDark },
  sectionLink: { ...typography.labelMd, color: colors.emeraldSuccess },
  goalCard: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.card,
    padding: spacing.stackMd, gap: spacing.stackSm,
    borderWidth: 1, borderColor: colors.surfaceContainer,
  },
  goalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.stackSm },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm, flex: 1 },
  goalInfo: { flex: 1 },
  goalEmoji: {
    width: sizes.iconMd, height: sizes.iconMd,
    alignItems: 'center', justifyContent: 'center',
  },
  goalEmojiText: { fontSize: sizes.emojiFontMd },
  goalName: { ...typography.bodyMdBold, color: colors.navyDark },
  goalPct: { ...typography.labelSm, color: colors.slateGray },
  goalRight: { alignItems: 'flex-end' },
  goalCurrent: { ...typography.bodyMd, color: colors.emeraldSuccess },
  goalTarget: { ...typography.labelXs, color: colors.slateGray },
  goalTrack: { height: sizes.trackXs, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.full, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: colors.emeraldSuccess, borderRadius: radius.full },
});
