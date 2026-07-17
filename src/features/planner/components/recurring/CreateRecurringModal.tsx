/**
 * CreateRecurringModal — Component
 *
 * @what     Modal formulario para crear un recurrente nuevo: Ingreso, Gasto o Deuda. Siempre 4
 *           pasos, uno por pregunta — más liviano que amontonar toggles en una sola pantalla.
 * @receives 4 props: visible, initialType, onClose, onCreate
 * @processes Secuencia (mismos 4 pasos, contenido cambia según tipo): RecurringFormStep1 (datos) →
 *           RecurringDayStep (los tres tipos: un día) → RecurringDurationStep (Ingreso/Gasto,
 *           ¿tiene fecha de fin?) o RecurringInstallmentsStep (Deuda, ¿único pago o cuotas?) →
 *           RecurringJarSelector. El chrome (sheet + header + teclado) lo pone `MoniSheet`: en el
 *           paso 0 el ícono cierra (sin `onBack`), en los siguientes es una flecha que retrocede.
 *           Cambiar Tipo resetea nombre/monto/frecuencia/fecha/cuotas a su default y vuelve al paso 1.
 * @returns  JSX — bottom sheet slide-up con el paso activo y su CTA.
 * @props    4: visible, initialType, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@shared/styles';
import { MoniButton, MoniSheet } from '@shared/components';
import { RecurringFormStep1 } from './RecurringFormStep1';
import { RecurringDayStep } from './RecurringDayStep';
import { RecurringDurationStep } from './RecurringDurationStep';
import { RecurringInstallmentsStep } from './RecurringInstallmentsStep';
import { RecurringJarSelector } from './RecurringJarSelector';
import { emptyRecurringForm, resetOnTipoChange } from './recurringFormHelpers';
import type { AgendaFilter, RecurringForm, CreateRecurringData } from '../../types';

type StepKey = 'datos' | 'fecha' | 'cuotas' | 'jarra';
const STEPS: StepKey[] = ['datos', 'fecha', 'cuotas', 'jarra'];

type Props = { visible: boolean; initialType: AgendaFilter; onClose: () => void; onCreate: (data: CreateRecurringData) => void };

export function CreateRecurringModal({ visible, initialType, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<RecurringForm>(() => emptyRecurringForm(initialType));
  const [stepIndex, setStepIndex] = useState(0);
  const isDeuda    = form.tipo === 'deudas';
  const currentKey = STEPS[stepIndex];
  const lastIndex  = STEPS.length - 1;

  useEffect(() => {
    if (visible) { setForm(emptyRecurringForm(initialType)); setStepIndex(0); }
  }, [visible, initialType]);

  function setField<K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) {
    if (key === 'tipo') setStepIndex(0);
    setForm((prev) => key === 'tipo' ? resetOnTipoChange(prev, val as AgendaFilter) : { ...prev, [key]: val });
  }

  const parsedMonto  = parseFloat(form.monto.replace(',', '.'));
  const canContinue  = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleSave() {
    if (!canContinue) return;
    onCreate({
      name: form.nombre.trim(), amount: parsedMonto, day: form.dia, filter: form.tipo,
      jarra: form.jarra, frecuencia: form.frecuencia, cuotas: form.cuotasTotales,
      unicoPago: form.unicoPago, cuotasPagadas: form.cuotasPagadas,
    });
    onClose();
  }

  return (
    <MoniSheet
      visible={visible}
      onClose={onClose}
      title="Programar compromiso"
      onBack={stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        {currentKey === 'datos' && <RecurringFormStep1 form={form} onChange={setField} />}
        {currentKey === 'fecha' && <RecurringDayStep form={form} onChange={setField} />}
        {currentKey === 'cuotas' && (isDeuda
          ? <RecurringInstallmentsStep form={form} onChange={setField} />
          : <RecurringDurationStep form={form} onChange={setField} />
        )}
        {currentKey === 'jarra' && <RecurringJarSelector jarra={form.jarra} onChange={(v) => setField('jarra', v)} />}
        {stepIndex < lastIndex
          ? <MoniButton label="Continuar" onPress={() => setStepIndex(stepIndex + 1)} disabled={!canContinue} />
          : <MoniButton label="Programar compromiso" onPress={handleSave} disabled={!canContinue} />
        }
      </ScrollView>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd, paddingBottom: spacing.stackLg },
});
