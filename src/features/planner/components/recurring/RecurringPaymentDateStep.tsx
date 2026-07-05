/**
 * RecurringPaymentDateStep — Component
 *
 * @what     Paso dedicado Deuda: "¿Qué día se paga?". Grid simple de día(s) por defecto; un link
 *           chico ("¿Paga distinto cada mes?") cambia a calendario mes por mes para deudas
 *           irregulares (ej. 2 cuotas en enero, 1 en febrero).
 * @receives 2 props: form, onChange
 * @processes Recurrente (default): `diasFijos`, mismo patrón se repite todos los meses.
 *           Personalizada: `diasPorMes` guarda selección independiente por mes. El link alterna
 *           `modoFecha` — no hay toggle visible con nombres técnicos, solo texto llano.
 * @returns  JSX — título + día(s) o calendario + link para alternar.
 * @props    2: form, onChange
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import { RecurringDayPicker } from './RecurringDayPicker';
import { RecurringMonthSelector } from './RecurringMonthSelector';
import type { RecurringForm } from '../../types';

type Props = {
  form: RecurringForm;
  onChange: <K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) => void;
};

export function RecurringPaymentDateStep({ form, onChange }: Props) {
  const isPersonal = form.modoFecha === 'personalizada';
  const diasDelMes = form.diasPorMes[form.mes] ?? [];

  function handleDiasPorMesChange(next: number[]) {
    onChange('diasPorMes', { ...form.diasPorMes, [form.mes]: next });
  }

  if (isPersonal) {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>¿Qué días se paga cada mes?</Text>
        <RecurringMonthSelector mes={form.mes} onChange={(v) => onChange('mes', v)} />
        <RecurringDayPicker mes={form.mes} selected={diasDelMes} onChange={handleDiasPorMesChange} />
        <Pressable onPress={() => onChange('modoFecha', 'recurrente')} hitSlop={8}>
          <Text style={styles.link}>¿Mismo día cada mes?</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.title}>¿Qué día se paga?</Text>
      <RecurringDayPicker selected={form.diasFijos} onChange={(v) => onChange('diasFijos', v)} />
      <Pressable onPress={() => onChange('modoFecha', 'personalizada')} hitSlop={8}>
        <Text style={styles.link}>¿Paga distinto cada mes?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.stackSm },
  title: { ...typography.labelSm, color: colors.onSurfaceVariant },
  link:  { ...typography.labelMd, color: colors.emeraldSuccess, textAlign: 'center', marginTop: spacing.stackXs },
});
