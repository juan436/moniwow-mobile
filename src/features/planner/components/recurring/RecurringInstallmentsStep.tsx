/**
 * RecurringInstallmentsStep — Component
 *
 * @what     Paso dedicado Deuda: "¿Cuántas cuotas tiene?". Toda deuda es finita (préstamo casa,
 *           carro, tarjeta a plazos siempre tiene un total de cuotas) — sin opción "sin fin".
 * @receives 2 props: form, onChange
 * @processes Recurrente: Cuotas totales + pagadas, ambas manuales (el patrón se repite, no hay
 *           forma de derivar cuántos meses dura). Personalizada: Cuotas totales ya está implícito
 *           en cuántos días se marcaron en el calendario — se muestra calculado, no se vuelve a
 *           preguntar; solo Cuotas pagadas es dato real que hace falta pedir.
 * @returns  JSX — título + StepperInput(s) según modo.
 * @props    2: form, onChange
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import { StepperInput } from '@shared/components';
import type { RecurringForm } from '../../types';

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringInstallmentsStep({ form, onChange }: Props) {
  const isPersonal = form.modoFecha === 'personalizada';

  if (isPersonal) {
    const total = Object.values(form.diasPorMes).reduce((sum, dias) => sum + dias.length, 0);
    return (
      <View style={styles.block}>
        <Text style={styles.info}>Ya definiste {total} cuota{total === 1 ? '' : 's'} en el calendario.</Text>
        <StepperInput label="Cuotas pagadas" value={form.cuotasPagadas} min={0} max={Math.max(total - 1, 0)} onChange={(v) => onChange('cuotasPagadas', v)} />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.title}>¿Cuántas cuotas tiene?</Text>
      <View style={styles.row2}>
        <View style={styles.flex1}>
          <StepperInput label="Cuotas totales" value={form.cuotasTotales} min={1} max={120} onChange={(v) => onChange('cuotasTotales', v)} />
        </View>
        <View style={styles.flex1}>
          <StepperInput label="Cuotas pagadas" value={form.cuotasPagadas} min={0} max={form.cuotasTotales - 1} onChange={(v) => onChange('cuotasPagadas', v)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.stackSm },
  row2:  { flexDirection: 'row', gap: spacing.stackMd },
  flex1: { flex: 1, gap: spacing.stackXs },
  title: { ...typography.labelSm, color: colors.onSurfaceVariant },
  info:  { ...typography.bodyMd, color: colors.onSurface },
});
