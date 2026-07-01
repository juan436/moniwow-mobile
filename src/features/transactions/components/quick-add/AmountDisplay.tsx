/**
 * AmountDisplay — Component
 *
 * @what     Hero del monto digitado en Paso 1 (Quick Add gasto o Registro ingreso).
 * @receives 2 props: amount (string dígitos), label (opcional)
 * @processes Muestra símbolo "$" + monto en tipografía heroDisplay 64px.
 * @returns  JSX — label + monto centrado ajustable.
 * @props    2: amount, label
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';

type Props = { amount: string; label?: string };

export function AmountDisplay({ amount, label = 'Monto del gasto' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
          {amount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:     { alignItems: 'center', paddingVertical: spacing.stackLg },
  label:    { ...typography.labelMd, color: colors.slateGray, marginBottom: spacing.stackSm },
  row:      { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.stackSm },
  currency: { ...typography.headlineMd, color: colors.slateGray, paddingBottom: spacing.stackSm },
  amount:   { ...typography.heroDisplay, color: colors.navyDark },
});
