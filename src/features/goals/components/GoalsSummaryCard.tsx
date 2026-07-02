/**
 * GoalsSummaryCard — Component
 *
 * @what     Card resumen de GoalsScreen: ahorro total acumulado + botón "Añadir" sueño.
 * @receives 2 props: ahorroTotal, onAdd
 * @processes Ninguno — presentación pura.
 * @returns  JSX — Card blanca con monto destacado y CTA.
 * @props    2: ahorroTotal, onAdd
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';

type Props = { ahorroTotal: number; onAdd: () => void };

export function GoalsSummaryCard({ ahorroTotal, onAdd }: Props) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.left}>
        <Text style={styles.label}>Ahorro total acumulado</Text>
        <Text style={styles.amount}>$ {ahorroTotal.toLocaleString('es')}.00</Text>
      </View>
      <Pressable style={styles.btnNew} onPress={onAdd}>
        <Text style={styles.btnNewText}>Añadir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.pureWhite,
    marginHorizontal: spacing.marginPage,
    marginTop: spacing.stackMd,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
  },
  left:   { gap: spacing.stackXs },
  label:  { ...typography.labelMd, color: colors.slateGray },
  amount: { ...typography.headlineMd, color: colors.goldDreams },
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
});
