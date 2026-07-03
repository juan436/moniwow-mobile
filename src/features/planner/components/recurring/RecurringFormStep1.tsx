/**
 * RecurringFormStep1 — Component
 *
 * @what     Paso 1 del formulario de compromiso recurrente: tipo (Ingreso/Gasto/Deuda) + nombre +
 *           monto. Lo esencial, antes de programar los detalles.
 * @receives 2 props: form, onChange
 * @processes Presentación pura, delega estado al padre (Create/EditRecurringModal).
 * @returns  JSX — Fragment: selector tipo + MoniInput nombre + input monto.
 * @props    2: form, onChange
 */
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput } from '@shared/components';
import type { AgendaFilter, RecurringForm } from '../../types';

const TIPOS: AgendaFilter[] = ['ingresos', 'gastos', 'deudas'];
const TIPO_LABEL: Record<AgendaFilter, string> = { ingresos: 'Ingreso', gastos: 'Gasto', deudas: 'Deuda' };

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringFormStep1({ form, onChange }: Props) {
  const isDeuda = form.tipo === 'deudas';

  return (
    <>
      <View style={styles.segRow}>
        {TIPOS.map((t) => (
          <Pressable key={t} style={[styles.seg, form.tipo === t && styles.segActive]} onPress={() => onChange('tipo', t)}>
            <Text style={[styles.segText, form.tipo === t && styles.segTextActive]}>{TIPO_LABEL[t]}</Text>
          </Pressable>
        ))}
      </View>
      <MoniInput
        label={isDeuda ? 'Acreedor' : 'Nombre'}
        value={form.nombre}
        onChangeText={(v) => onChange('nombre', v)}
        placeholder={isDeuda ? 'ej. Banco Visa' : 'ej. Netflix'}
      />
      <View style={styles.block}>
        <Text style={styles.fieldLabel}>Monto</Text>
        <TextInput style={styles.numInput} value={form.monto} onChangeText={(v) => onChange('monto', v)} placeholder="$ 0.00" placeholderTextColor={colors.outlineVariant} keyboardType="numeric" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  segRow:     { flexDirection: 'row', gap: spacing.stackSm },
  seg:        { flex: 1, paddingVertical: spacing.stackSm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  segActive:     { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  segText:       { ...typography.labelMd, color: colors.slateGray },
  segTextActive: { color: colors.pureWhite },
  block:      { gap: spacing.stackSm },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  numInput: {
    height: spacing.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    backgroundColor: colors.pureWhite,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
