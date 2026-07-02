/**
 * GoalCard — Component
 *
 * @what     Card premium de meta individual: accent bar esmeralda + porcentaje prominente + progreso.
 * @receives 3 props: goal, onPress, onDeposit?
 * @processes Calcula estrellas (progress/20 cap 5). Muestra badge si stars===0. Llama onPress(goal) al
 *           tap de la card, onDeposit(goal) al tap del botón "+" (Pressable anidado — no burbujea).
 *           Sin onDeposit (modo retirar), el botón "+" no se renderiza.
 * @returns  JSX — Pressable card con accent bar izquierda, barra de progreso gruesa, StarRow y montos.
 * @props    3: goal, onPress, onDeposit?
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { StarRow } from './StarRow';
import type { GoalItem } from '../types';

function calcStars(progress: number): number {
  return Math.min(Math.floor(progress / 20), 5);
}

type Props = { goal: GoalItem; onPress: (goal: GoalItem) => void; onDeposit?: (goal: GoalItem) => void };

export function GoalCard({ goal, onPress, onDeposit }: Props) {
  const stars      = calcStars(goal.progress);
  const showBadge  = stars === 0;
  const handlePress   = useCallback(() => onPress(goal), [onPress, goal]);
  const handleDeposit = useCallback(() => onDeposit?.(goal), [onDeposit, goal]);

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, shadows.card, pressed && styles.pressed]}>
      <View style={styles.accentBar} />

      <View style={styles.inner}>
        <View style={styles.cardTop}>
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{goal.emoji}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.goalName} numberOfLines={1}>{goal.name}</Text>
            <Text style={styles.statusLabel}>{goal.statusLabel}</Text>
          </View>
          <Text style={styles.pctLabel}>{goal.progress}%</Text>
          {onDeposit && (
            <Pressable onPress={handleDeposit} hitSlop={8} style={styles.depositBtn}>
              <MaterialIcons name="add" size={16} color={colors.emeraldSuccess} />
            </Pressable>
          )}
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${goal.progress}%` as `${number}%` }]} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.amountRow}>
            <Text style={styles.amountCurrent}>$ {goal.current.toLocaleString('es')}</Text>
            <Text style={styles.amountTarget}>/ $ {goal.target.toLocaleString('es')}</Text>
          </View>
          {showBadge
            ? <View style={styles.badge}><Text style={styles.badgeText}>¡Casi 1ra ⭐!</Text></View>
            : <StarRow stars={stars} />
          }
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.emeraldSuccess,
  },
  inner: {
    flex: 1,
    padding: spacing.cardPadding,
    gap: spacing.stackSm,
  },
  cardTop:    { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  depositBtn: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    backgroundColor: colors.emeraldTint, alignItems: 'center', justifyContent: 'center',
  },
  emojiWrap: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji:      { fontSize: sizes.emojiFontMd },
  cardInfo:   { flex: 1, gap: spacing.stackXs },
  goalName:   { ...typography.bodyMdBold, color: colors.navyDark },
  statusLabel:{ ...typography.labelSm, color: colors.slateGray },
  pctLabel:   { ...typography.headlineMd, color: colors.emeraldSuccess },

  progressTrack: {
    height: sizes.trackSm,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.emeraldSuccess,
    borderRadius: radius.full,
  },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountRow:  { flexDirection: 'row', alignItems: 'baseline', gap: spacing.stackXs },
  amountCurrent: { ...typography.labelMd, color: colors.emeraldSuccess },
  amountTarget:  { ...typography.labelXs, color: colors.slateGray },

  badge:     { backgroundColor: colors.goldTint, borderRadius: radius.chip, paddingHorizontal: spacing.stackSm, paddingVertical: spacing.stackXs },
  badgeText: { ...typography.labelSm, color: colors.goldDreams },
  pressed:   { opacity: 0.85 },
});
