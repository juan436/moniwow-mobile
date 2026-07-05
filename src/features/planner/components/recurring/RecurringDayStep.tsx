/**
 * RecurringDayStep — Component
 *
 * @what     Paso dedicado Ingreso/Gasto: "¿Qué día se cobra?" (Ingreso) o "¿Qué día se paga?"
 *           (Gasto). Sin mes — son mensuales recurrentes, la duración ya la resuelve
 *           RecurringDurationStep ("¿Tiene fecha de fin?").
 * @receives 2 props: form, onChange
 * @processes Ingreso permite multi-día (ej. sueldo el 15 y el último del mes) — reutiliza
 *           `diasFijos`, mismo campo que usa Deuda en modo Recurrente, sin conflicto porque son
 *           tipos mutuamente excluyentes. Gasto queda en un solo día (`dia`, modo `single` del
 *           picker) — caso simple, sin necesidad confirmada de multi-día.
 * @returns  JSX — título + RecurringDayPicker (single para Gasto, multi para Ingreso).
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
  const isIngreso = form.tipo === 'ingresos';
  const title = isIngreso ? '¿Qué día se cobra?' : '¿Qué día se paga?';

  return (
    <View style={styles.block}>
      <Text style={styles.title}>{title}</Text>
      {isIngreso
        ? <RecurringDayPicker selected={form.diasFijos} onChange={(v) => onChange('diasFijos', v)} />
        : <RecurringDayPicker single selected={[form.dia]} onChange={([d]) => onChange('dia', d)} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.stackSm },
  title: { ...typography.labelSm, color: colors.onSurfaceVariant },
});
