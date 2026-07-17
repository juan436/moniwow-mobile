/**
 * RecurringInstallmentsStep — Component
 *
 * @what     Paso dedicado Deuda: "Único pago" o deuda a plazos.
 * @receives 2 props: form, onChange
 * @processes `unicoPago` marcado (default) = el total se paga de una, el día elegido — el caso
 *           corriente ("le debo $400 y se los doy el 15"). Antes el wizard OBLIGABA a inventar
 *           cuotas para toda deuda. Al desmarcar aparecen Totales + Pagadas.
 *           **Cuotas pagadas** son las que venían pagadas ANTES de registrar la deuda acá: historia
 *           previa que el libro no puede saber porque ocurrió antes. No es el `paidCuotas` difunto
 *           (aquel mutaba en cada pago y era la fuente de verdad); del registro en adelante manda
 *           el libro. Ver [[planes/deuda-simple-y-cuotas]].
 * @returns  JSX — Checkbox + (si está desmarcado) los dos StepperInput.
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

export function RecurringInstallmentsStep({ form, onChange }: Props) {
  function handleToggleUnicoPago() {
    onChange('unicoPago', !form.unicoPago);
  }

  return (
    <View style={styles.block}>
      <Text style={styles.title}>¿Cómo se paga?</Text>

      <Checkbox checked={form.unicoPago} label="Único pago" onToggle={handleToggleUnicoPago} />

      {form.unicoPago ? (
        <Text style={styles.hint}>Se paga todo junto el día que elegiste.</Text>
      ) : (
        <View style={styles.row2}>
          <View style={styles.flex1}>
            <StepperInput label="Cuotas totales" value={form.cuotasTotales} min={2} max={120} onChange={(v) => onChange('cuotasTotales', v)} />
          </View>
          <View style={styles.flex1}>
            <StepperInput label="Cuotas pagadas" value={form.cuotasPagadas} min={0} max={form.cuotasTotales - 1} onChange={(v) => onChange('cuotasPagadas', v)} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.stackSm },
  row2:  { flexDirection: 'row', gap: spacing.stackMd },
  flex1: { flex: 1, gap: spacing.stackXs },
  title: { ...typography.labelSm, color: colors.onSurfaceVariant },
  hint:  { ...typography.labelSm, color: colors.slateGray },
});
