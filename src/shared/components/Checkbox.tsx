/**
 * Checkbox — Component
 *
 * @what     Checkbox cuadrado con label, patrón visual estándar (Listas, Presupuesto/Blindado de
 *           jarra). Extraído para no seguir duplicando los mismos estilos en cada feature.
 * @receives 3 props: checked, label, onToggle
 * @processes Presentación pura. Check ✓ blanco sobre fondo emeraldSuccess al marcar.
 * @returns  JSX — Pressable row: cuadrado + label.
 * @props    3: checked, label, onToggle
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, sizes } from '../styles';

type Props = { checked: boolean; label: string; onToggle: () => void };

export function Checkbox({ checked, label, onToggle }: Props) {
  return (
    <Pressable style={styles.row} onPress={onToggle} hitSlop={4}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  box: {
    width: sizes.checkboxSm, height: sizes.checkboxSm, borderRadius: radius.sm,
    borderWidth: 2, borderColor: colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  checkmark: { color: colors.pureWhite, fontSize: typography.labelMd.fontSize },
  label: { ...typography.labelMd, color: colors.onSurface },
});
