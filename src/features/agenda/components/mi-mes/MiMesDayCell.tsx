/**
 * MiMesDayCell — Component
 *
 * @what     Celda individual del calendario Mi Mes: número de día + dot si tiene ítems.
 * @receives 5 props: day, isSelected, hasItems, dotColor, onPress
 * @processes useCallback sobre onPress(day). Estilos según selected/hasItems.
 * @returns  JSX — Pressable con bubble de número y dot opcional.
 * @props    5: day, isSelected, hasItems, dotColor, onPress
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, radius, spacing } from '@shared/styles';

type Props = {
  day: number;
  isSelected: boolean;
  hasItems: boolean;
  dotColor: string;
  onPress: (day: number) => void;
};

export function MiMesDayCell({ day, isSelected, hasItems, dotColor, onPress }: Props) {
  const handlePress = useCallback(() => onPress(day), [day, onPress]);

  return (
    <Pressable style={styles.cell} onPress={handlePress}>
      <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
        <Text style={[styles.label, isSelected && styles.labelSelected]}>{day}</Text>
      </View>
      {hasItems && <View style={[styles.dot, { backgroundColor: isSelected ? colors.pureWhite : dotColor }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell:           { flex: 1, alignItems: 'center', paddingVertical: spacing.stackXs, gap: spacing.stackXxs },
  bubble:         { width: 30, height: 30, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  bubbleSelected: { backgroundColor: colors.emeraldSuccess },
  label:          { ...typography.labelMd, color: colors.navyDark },
  labelSelected:  { color: colors.pureWhite },
  dot:            { width: 4, height: 4, borderRadius: radius.full },
});
