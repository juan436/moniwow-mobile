/**
 * GoalsTransferScreen — Component (Screen)
 *
 * @what     Selector dedicado de meta para retirar — pantalla propia, distinta de GoalsScreen (M10).
 * @receives —
 * @processes Se llega desde GoalsJarSheet → "Transferir". Lista de metas (useGoals, mismo mock que
 *           GoalsScreen — no comparten estado entre pantallas, mismo límite mock-stage que el resto
 *           de hooks del proyecto hasta conectar backend). Tap en una card abre SacrificeSheet
 *           (Slider de Sacrificio); confirmar llama handleWithdraw y cierra el modal.
 * @returns  JSX — Header con back + lista de GoalCard (sin botón Aportar) + SacrificeSheet.
 * @props    —
 */
import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { GoalCard } from './GoalCard';
import { SacrificeSheet } from './SacrificeSheet';
import { useGoals } from '../hooks/useGoals';
import type { GoalItem } from '../types';

function handleBack() { router.back(); }

export function GoalsTransferScreen() {
  const insets = useSafeAreaInsets();
  const { goals, handleWithdraw } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

  const handleGoalPress = useCallback((goal: GoalItem) => setSelectedGoal(goal), []);
  const handleCloseSacrifice = useCallback(() => setSelectedGoal(null), []);
  const handleConfirm = useCallback((amount: number) => {
    if (selectedGoal) handleWithdraw(selectedGoal.id, amount);
    setSelectedGoal(null);
  }, [selectedGoal, handleWithdraw]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
        <Pressable style={styles.backBtn} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
        </Pressable>
        <Text style={styles.headerTitle}>¿De cuál Meta retirás?</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.stackLg * 2 }]}
        showsVerticalScrollIndicator={false}
      >
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onPress={handleGoalPress} />
        ))}
      </ScrollView>

      <SacrificeSheet visible={selectedGoal !== null} goal={selectedGoal} onClose={handleCloseSacrifice} onConfirm={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackSm,
    backgroundColor: colors.pureWhite,
  },
  backBtn: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...typography.headlineMd, color: colors.navyDark },
  content: { padding: spacing.marginPage, gap: spacing.stackMd },
});
