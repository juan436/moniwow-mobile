/**
 * GoalsScreen — Component (Screen)
 *
 * @what     M10 — Proyectos de Vida: resumen compacto + lista de metas + hide-on-scroll.
 * @receives —
 * @processes GoalsHeader (back + título) se oculta al hacer scroll down y reaparece al subir.
 *           Estado/CRUD de metas vive en useGoals — este componente solo orquesta presentación.
 *           Con ?mode=withdraw (llegado desde AhorroDetailModal → Transferir), tap en una card abre
 *           SacrificeModal en vez de EditGoalModal, y se ocultan "Añadir"/"+" Aportar — pantalla de
 *           selector puro. Ver [[planes/psicologia-ux]].
 * @returns  JSX — GoalsHeader flotante animado + ScrollView con summary card + cards.
 * @props    —
 */
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing, radius } from '@shared/styles';
import { GoalCard } from './GoalCard';
import { GoalsHeader } from './GoalsHeader';
import { GoalsSummaryCard } from './GoalsSummaryCard';
import { CreateGoalModal } from './CreateGoalModal';
import { EditGoalModal } from './EditGoalModal';
import { SacrificeModal } from './SacrificeModal';
import { DepositModal } from './DepositModal';
import { useGoals } from '../hooks/useGoals';
import type { GoalItem } from '../types';

export function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isWithdrawMode = mode === 'withdraw';
  const {
    goals, isAddVisible, selectedGoal, ahorroTotal,
    handleAnadir, handleCloseAdd, handleCreate,
    handleCardPress, handleCloseEdit, handleSave, handleDelete,
    handleWithdraw, handleDeposit,
  } = useGoals();
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [withdrawGoal, setWithdrawGoal] = useState<GoalItem | null>(null);
  const [depositGoal, setDepositGoal]   = useState<GoalItem | null>(null);

  function handleGoalTap(goal: GoalItem) {
    if (isWithdrawMode) setWithdrawGoal(goal);
    else handleCardPress(goal);
  }
  function handleConfirmWithdraw(amount: number) {
    if (withdrawGoal) handleWithdraw(withdrawGoal.id, amount);
    setWithdrawGoal(null);
  }
  function handleConfirmDeposit(amount: number) {
    if (depositGoal) handleDeposit(depositGoal.id, amount);
  }

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(1, headerHeight)],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <GoalsSummaryCard ahorroTotal={ahorroTotal} onAdd={isWithdrawMode ? undefined : handleAnadir} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{isWithdrawMode ? '¿De qué sueño retirás?' : 'Mis proyectos'}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{goals.length}</Text>
          </View>
        </View>

        <View style={styles.cardList}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onPress={handleGoalTap} onDeposit={isWithdrawMode ? undefined : setDepositGoal} />
          ))}
        </View>
      </Animated.ScrollView>

      <CreateGoalModal visible={isAddVisible} onClose={handleCloseAdd} onCreate={handleCreate} />
      <EditGoalModal visible={selectedGoal !== null} goal={selectedGoal} onClose={handleCloseEdit} onSave={handleSave} onDelete={handleDelete} />
      <SacrificeModal visible={withdrawGoal !== null} goal={withdrawGoal} onClose={() => setWithdrawGoal(null)} onConfirm={handleConfirmWithdraw} />
      <DepositModal visible={depositGoal !== null} goal={depositGoal} onClose={() => setDepositGoal(null)} onConfirm={handleConfirmDeposit} />

      <View style={[styles.statusBarBg, { height: insets.top }]} />
      <Animated.View
        style={[styles.headerFloat, { transform: [{ translateY: headerTranslateY }] }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <GoalsHeader topInset={insets.top} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  scroll:      { flex: 1 },
  content:     { flexGrow: 1, paddingBottom: spacing.stackLg * 2 },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.pureWhite },
  headerFloat: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.pureWhite },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    paddingHorizontal: spacing.marginPage,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackSm,
  },
  sectionTitle: { ...typography.bodyMdBold, color: colors.navyDark },
  countBadge: {
    backgroundColor: colors.navyTint,
    borderRadius: radius.full,
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.stackXs,
  },
  countText: { ...typography.labelXs, color: colors.navyDark },

  cardList: { gap: spacing.stackMd, paddingHorizontal: spacing.marginPage },
});
