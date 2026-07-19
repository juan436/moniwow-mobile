/**
 * JarRedNudge — Component
 *
 * @what     Aviso rojo (M03 §3) para una jarra en negativo: muestra el déficit y ofrece "Reequilibrar"
 *           (cubrir el rojo transfiriendo de otra jarra). Lo renderiza JarDetailSheet cuando isNegative.
 * @receives 2 props: deficit (monto faltante, positivo), onRebalance
 * @returns  JSX — banner errorContainer + botón.
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton } from '@shared/components';

type Props = { deficit: number; onRebalance: () => void };

export function JarRedNudge({ deficit, onRebalance }: Props) {
  return (
    <View style={styles.nudge}>
      <Text style={styles.text}>En rojo: te faltan $ {deficit.toLocaleString('es')}</Text>
      <MoniButton label="Reequilibrar" onPress={onRebalance} />
    </View>
  );
}

const styles = StyleSheet.create({
  nudge: { backgroundColor: colors.errorContainer, borderRadius: radius.md, padding: spacing.gutter, gap: spacing.stackSm },
  text:  { ...typography.labelMd, color: colors.error },
});
