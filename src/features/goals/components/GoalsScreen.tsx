/**
 * GoalsScreen — Component (Screen)
 *
 * @what     M10 — Proyectos de Vida: resumen compacto + lista de metas + hide-on-scroll.
 * @receives —
 * @processes GoalsHeader (back + título) se oculta al hacer scroll down y reaparece al subir.
 *           Estado/CRUD de metas vive en useGoals — este componente solo orquesta presentación.
 * @returns  JSX — GoalsHeader flotante animado + ScrollView con summary card + cards.
 * @props    —
 */
import { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { GoalCard } from './GoalCard';
import { GoalsHeader } from './GoalsHeader';
import { CreateGoalModal } from './CreateGoalModal';
import { EditGoalModal } from './EditGoalModal';
import { useGoals } from '../hooks/useGoals';

export function GoalsScreen() {
  const insets = useSafeAreaInsets();
  const {
    goals, isAddVisible, selectedGoal, ahorroTotal,
    handleAnadir, handleCloseAdd, handleCreate,
    handleCardPress, handleCloseEdit, handleSave, handleDelete,
  } = useGoals();
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

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
        <View style={[styles.summaryCard, shadows.card]}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Ahorro total acumulado</Text>
            <Text style={styles.summaryAmount}>$ {ahorroTotal.toLocaleString('es')}.00</Text>
          </View>
          <Pressable style={styles.btnNew} onPress={handleAnadir}>
            <Text style={styles.btnNewText}>Añadir</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis proyectos</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{goals.length}</Text>
          </View>
        </View>

        <View style={styles.cardList}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onPress={handleCardPress} />
          ))}
        </View>
      </Animated.ScrollView>

      <CreateGoalModal visible={isAddVisible} onClose={handleCloseAdd} onCreate={handleCreate} />
      <EditGoalModal visible={selectedGoal !== null} goal={selectedGoal} onClose={handleCloseEdit} onSave={handleSave} onDelete={handleDelete} />

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

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.pureWhite,
    marginHorizontal: spacing.marginPage,
    marginTop: spacing.stackMd,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
  },
  summaryLeft:   { gap: spacing.stackXs },
  summaryLabel:  { ...typography.labelMd, color: colors.slateGray },
  summaryAmount: { ...typography.headlineMd, color: colors.goldDreams },

  btnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackXs,
    backgroundColor: colors.goldDreams,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackSm,
    borderRadius: radius.full,
  },
  btnNewText: { ...typography.labelMd, color: colors.pureWhite },

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
