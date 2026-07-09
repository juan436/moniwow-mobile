/**
 * Checkbox — Component
 *
 * @what     Checkbox cuadrado con label, patrón visual estándar (Listas, Presupuesto/Blindado de
 *           jarra). Extraído para no seguir duplicando los mismos estilos en cada feature.
 * @receives 4 props: checked, label, onToggle, disabled?
 * @processes Presentación pura. Check ✓ blanco sobre fondo emeraldSuccess al marcar. `disabled`
 *           bloquea el toggle y atenúa (para flags que la regla de negocio no permite cambiar).
 * @returns  JSX — Pressable row: cuadrado + label.
 * @props    4: checked, label, onToggle, disabled?
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, sizes } from '../styles';

type Props = { checked: boolean; label: string; onToggle: () => void; disabled?: boolean };

export function Checkbox({ checked, label, onToggle, disabled = false }: Props) {
  return (
    <Pressable style={[styles.row, disabled && styles.rowDisabled]} onPress={onToggle} disabled={disabled} hitSlop={4}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  rowDisabled: { opacity: 0.4 },
  box: {
    width: sizes.checkboxSm, height: sizes.checkboxSm, borderRadius: radius.sm,
    borderWidth: 2, borderColor: colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  checkmark: { color: colors.pureWhite, fontSize: typography.labelMd.fontSize },
  label: { ...typography.labelMd, color: colors.onSurface },
});
