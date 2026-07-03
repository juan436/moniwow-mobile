/**
 * RecurringFormStep2 — Component
 *
 * @what     Paso 2 del formulario de compromiso recurrente: día/mes, cuotas o frecuencia, jarra
 *           de pago. Los detalles de programación, después de lo esencial del Paso 1.
 * @receives 2 props: form, onChange
 * @processes Cuotas solo si tipo=deudas o frecuencia=cuotas; frecuencia solo si tipo≠deudas. Chips
 *           de jarra usan MaterialIcons reales (mismo set que IconPicker de Jarras), no emojis
 *           Unicode — antes tenían su propio set de emoji distinto al de las jarras reales.
 * @returns  JSX — Fragment: StepperInput día/mes, cuotas o frecuencia, chips de jarra con ícono.
 * @props    2: form, onChange
 */
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colors, typography, spacing, radius } from '@shared/styles';
import { StepperInput } from '@shared/components';
import type { RecurringForm, RecurringFrequency, RecurringJar } from '../../types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const JARRAS: { key: RecurringJar; label: string; iconName: IconName }[] = [
  { key: 'hogar',       label: 'Hogar',        iconName: 'home' },
  { key: 'goals',       label: 'Metas',        iconName: 'savings' },
  { key: 'libre',       label: 'Libre',        iconName: 'account-balance-wallet' },
  { key: 'transporte',  label: 'Transporte',   iconName: 'directions-bus' },
  { key: 'salud',       label: 'Salud',        iconName: 'favorite' },
  { key: 'educacion',   label: 'Educación',    iconName: 'school' },
  { key: 'viajes',      label: 'Viajes',       iconName: 'flight' },
  { key: 'emergencias', label: 'Emergencias',  iconName: 'security' },
  { key: 'ocio',        label: 'Ocio',         iconName: 'sports-esports' },
];
const FRECUENCIAS: { key: RecurringFrequency; label: string }[] = [
  { key: 'indefinido', label: 'Indefinido'  },
  { key: 'cuotas',     label: 'Por cuotas' },
];

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringFormStep2({ form, onChange }: Props) {
  const isDeuda    = form.tipo === 'deudas';
  const showCuotas = !isDeuda && form.frecuencia === 'cuotas';

  return (
    <>
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
              <MaterialIcons name={j.iconName} size={16} color={form.jarra === j.key ? colors.pureWhite : colors.slateGray} />
              <Text style={[styles.segText, form.jarra === j.key && styles.segTextActive]}>{j.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row2:       { flexDirection: 'row', gap: spacing.stackMd },
  flex1:      { flex: 1, gap: spacing.stackXs },
  block:      { gap: spacing.stackSm },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  segRow:     { flexDirection: 'row', gap: spacing.stackSm },
  seg:        { flex: 1, paddingVertical: spacing.stackSm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  jarraItem:  { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingVertical: spacing.stackSm, paddingHorizontal: spacing.gutter, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant },
  segActive:     { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  segText:       { ...typography.labelMd, color: colors.slateGray },
  segTextActive: { color: colors.pureWhite },
});
