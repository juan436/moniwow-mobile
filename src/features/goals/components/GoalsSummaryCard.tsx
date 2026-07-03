/**
 * GoalsSummaryCard — Component
 *
 * @what     Card resumen de GoalsScreen: total del pozo Metas + disponible sin asignar + botón
 *           "Añadir" meta opcional.
 * @receives 3 props: poolTotal, disponible, onAdd?
 * @processes Sin onAdd (modo retirar), el botón no se renderiza — pantalla de selector puro.
 *           `disponible` es lo que queda sin repartir del pozo (modelo "pozo financiado, luego
 *           repartido" — ver [[planes/psicologia-ux]]). Aportar a una meta lo consume.
 * @returns  JSX — Card blanca con monto destacado + disponible + CTA opcional.
 * @props    3: poolTotal, disponible, onAdd?
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { MoniButton } from '@shared/components';

type Props = { poolTotal: number; disponible: number; onAdd?: () => void };

export function GoalsSummaryCard({ poolTotal, disponible, onAdd }: Props) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.left}>
        <Text style={styles.label}>Total acumulado</Text>
        <Text style={styles.amount}>$ {poolTotal.toLocaleString('es')}.00</Text>
        <Text style={styles.available} numberOfLines={1}>Disponible: $ {disponible.toLocaleString('es')}</Text>
      </View>
      {onAdd && (
        <View style={styles.btnWrap}>
          <MoniButton label="Añadir" onPress={onAdd} variant="secondary" size="sm" />
        </View>
      )}
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
  left:      { flex: 1, gap: spacing.stackXs, marginRight: spacing.stackMd },
  label:     { ...typography.labelMd, color: colors.slateGray },
  amount:    { ...typography.headlineMd, color: colors.goldDreams },
  available: { ...typography.labelSm, color: colors.slateGray },
  btnWrap:   { flexShrink: 0 },
});
