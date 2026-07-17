/**
 * RecurringDayStep — Component
 *
 * @what     Paso dedicado Ingreso/Gasto: "¿Qué día se cobra?" (Ingreso) o "¿Qué día se paga?"
 *           (Gasto). Sin mes — son mensuales recurrentes, la duración ya la resuelve
 *           RecurringDurationStep ("¿Tiene fecha de fin?").
 * @receives 2 props: form, onChange
 * @processes Un solo día (`dia`), igual para los TRES tipos (Deuda también, desde que murió su paso
 *           propio). El Ingreso ofrecía multi-día ("sueldo el 15 y el último") pero `Recurrence`
 *           guarda UN `dayOfMonth` y se guardaba solo el primero: la pantalla prometía lo que el
 *           modelo no puede guardar. Un sueldo quincenal se modela como DOS reglas ("Sueldo 1" el
 *           15, "Sueldo 2" el 31), que además es más fiel — son dos cobros que se confirman por
 *           separado. El 31 vale como "el último": `Recurrence.dueDateFor` lo clampea al último día
 *           real de cada mes. Ver [[planes/fechas-y-quincenal]] y [[planes/deuda-simple-y-cuotas]].
 * @returns  JSX — título + RecurringDayPicker single.
 * @props    2: form, onChange
 */
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import { RecurringDayPicker } from './RecurringDayPicker';
import type { RecurringForm } from '../../types';

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringDayStep({ form, onChange }: Props) {
  const title = form.tipo === 'ingresos' ? '¿Qué día se cobra?' : '¿Qué día se paga?';

  return (
    <View style={styles.block}>
      <Text style={styles.title}>{title}</Text>
      <RecurringDayPicker single selected={[form.dia]} onChange={([d]) => onChange('dia', d)} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.stackSm },
  title: { ...typography.labelSm, color: colors.onSurfaceVariant },
});
