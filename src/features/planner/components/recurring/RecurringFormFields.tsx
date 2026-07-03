/**
 * RecurringFormFields — Component
 *
 * @what     Campos de formulario compartidos por Create/EditRecurringModal.
 * @receives 2 props: form, onChange
 * @processes Campos condicionales: cuotas solo si tipo=deudas o frecuencia=cuotas; frecuencia solo si tipo≠deudas.
 * @returns  JSX — Fragment: selector tipo, nombre, monto, día/mes, cuotas o frecuencia, jarra.
 * @props    2: form, onChange
 */
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, StepperInput } from '@shared/components';
import type { AgendaFilter, RecurringForm, RecurringFrequency, RecurringJar } from '../../types';

const TIPOS: AgendaFilter[] = ['ingresos', 'gastos', 'deudas'];
const TIPO_LABEL: Record<AgendaFilter, string> = { ingresos: 'Ingreso', gastos: 'Gasto', deudas: 'Deuda' };
const JARRAS: { key: RecurringJar; label: string }[] = [
  { key: 'hogar',       label: '🏠 Hogar'       },
  { key: 'goals',       label: '💰 Metas'       },
  { key: 'libre',       label: '🍃 Libre'       },
  { key: 'transporte',  label: '🚗 Transporte'  },
  { key: 'salud',       label: '❤️ Salud'       },
  { key: 'educacion',   label: '📚 Educación'   },
  { key: 'viajes',      label: '✈️ Viajes'      },
  { key: 'emergencias', label: '🛡️ Emergencias' },
  { key: 'ocio',        label: '🎮 Ocio'        },
];
const FRECUENCIAS: { key: RecurringFrequency; label: string }[] = [
  { key: 'indefinido', label: 'Indefinido'  },
  { key: 'cuotas',     label: 'Por cuotas' },
];

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringFormFields({ form, onChange }: Props) {
  const isDeuda    = form.tipo === 'deudas';
  const showCuotas = !isDeuda && form.frecuencia === 'cuotas';

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
      <View style={styles.row2}>
        <View style={styles.flex1}>
          <StepperInput label="Día" value={form.dia} min={1} max={31} onChange={(v) => onChange('dia', v)} />
        </View>
        <View style={styles.flex1}>
          <StepperInput label="Mes" value={form.mes} min={1} max={12} onChange={(v) => onChange('mes', v)} />
        </View>
      </View>
      {isDeuda && (
        <View style={styles.row2}>
          <View style={styles.flex1}>
            <StepperInput label="Cuotas totales" value={form.cuotasTotales} min={1} max={120} onChange={(v) => onChange('cuotasTotales', v)} />
          </View>
          <View style={styles.flex1}>
            <StepperInput label="Cuotas pagadas" value={form.cuotasPagadas} min={0} max={form.cuotasTotales - 1} onChange={(v) => onChange('cuotasPagadas', v)} />
          </View>
        </View>
      )}
      {!isDeuda && (
        <View style={styles.block}>
          <Text style={styles.fieldLabel}>Frecuencia</Text>
          <View style={styles.segRow}>
            {FRECUENCIAS.map((f) => (
              <Pressable key={f.key} style={[styles.seg, form.frecuencia === f.key && styles.segActive]} onPress={() => onChange('frecuencia', f.key)}>
                <Text style={[styles.segText, form.frecuencia === f.key && styles.segTextActive]}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
          {showCuotas && (
            <StepperInput label="Cuotas totales" value={form.cuotasTotales} min={1} max={120} onChange={(v) => onChange('cuotasTotales', v)} />
          )}
        </View>
      )}
      <View style={styles.block}>
        <Text style={styles.fieldLabel}>Jarra de pago</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segRow}>
          {JARRAS.map((j) => (
            <Pressable key={j.key} style={[styles.jarraItem, form.jarra === j.key && styles.segActive]} onPress={() => onChange('jarra', j.key)}>
              <Text style={[styles.segText, form.jarra === j.key && styles.segTextActive]}>{j.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  segRow:     { flexDirection: 'row', gap: spacing.stackSm },
  seg:        { flex: 1, paddingVertical: spacing.stackSm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  jarraItem:  { paddingVertical: spacing.stackSm, paddingHorizontal: spacing.gutter, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  segActive:     { backgroundColor: colors.navyDark, borderColor: colors.navyDark },
  segText:       { ...typography.labelMd, color: colors.slateGray },
  segTextActive: { color: colors.pureWhite },
  row2:      { flexDirection: 'row', gap: spacing.stackMd },
  flex1:     { flex: 1, gap: spacing.stackXs },
  block:     { gap: spacing.stackSm },
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
