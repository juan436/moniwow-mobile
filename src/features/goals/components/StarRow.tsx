/**
 * StarRow — Component
 *
 * @what     Fila de 5 estrellas para sistema de gamificación M10.
 * @receives 1 prop: stars (0-5)
 * @processes N estrellas en goldDreams, resto en surfaceContainerHigh.
 * @returns  JSX — fila horizontal de 5 estrellas.
 * @props    1: stars
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, spacing } from '@shared/styles';

type Props = { stars: number };

export function StarRow({ stars }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} style={[styles.star, i < stars && styles.starFilled]}>★</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row:        { flexDirection: 'row', gap: spacing.stackXs },
  star:       { fontSize: 22, color: colors.surfaceContainerHigh },
  starFilled: { color: colors.goldDreams },
});
