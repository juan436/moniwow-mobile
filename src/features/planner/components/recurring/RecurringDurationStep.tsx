/**
 * RecurringDurationStep — Component
 *
 * @what     Paso dedicado Ingreso/Gasto: "¿Tiene fecha de fin?". A diferencia de Deuda, acá sí
 *           tiene sentido "sin fin" (sueldo indefinido, suscripción indefinida) — Checkbox en vez
 *           de nombre técnico ("Frecuencia: Indefinido/Por cuotas").
 * @receives 2 props: form, onChange
 * @processes Checkbox marcado → `frecuencia:'indefinido'`. Desmarcado → `frecuencia:'cuotas'`,
 *           muestra "Duración (meses)" — no "Cuotas totales", esa es terminología de préstamo y
 *           no encaja con un ingreso/gasto temporal (contrato, suscripción). Sin "Cuotas pagadas"
 *           — Ingreso/Gasto no llevan ese conteo.
 * @returns  JSX — título + Checkbox + StepperInput condicional.
 * @props    2: form, onChange
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import { StepperInput, Checkbox } from '@shared/components';
import type { RecurringForm } from '../../types';

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringDurationStep({ form, onChange }: Props) {
  const sinFin = form.frecuencia === 'indefinido';

  return (
    <View style={styles.block}>
      <Text style={styles.title}>¿Tiene fecha de fin?</Text>
      <Checkbox
        checked={sinFin}
        label="Sin fecha de fin"
        onToggle={() => onChange('frecuencia', sinFin ? 'cuotas' : 'indefinido')}
      />
      {!sinFin && (
        <StepperInput label="Duración (meses)" value={form.cuotasTotales} min={1} max={120} onChange={(v) => onChange('cuotasTotales', v)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.stackSm },
  title: { ...typography.labelSm, color: colors.onSurfaceVariant },
});
