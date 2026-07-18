/**
 * EditRecurringSheet — Component
 *
 * @what     Modal formulario para editar o eliminar un recurrente existente. Siempre 4 pasos, uno
 *           por pregunta — mismo patrón que CreateRecurringSheet.
 * @receives 5 props: visible, item, onClose, onSave, onDelete
 * @processes Paso 1: tipo + nombre + monto + "Cancelar compromiso" (acceso rápido, no obliga a pasar
 *           los pasos siguientes). Mismos 4 pasos que CreateRecurringSheet, contenido según
 *           tipo. El chrome (sheet + header + teclado) lo pone `MoniSheet`: paso 0 cierra, siguientes
 *           retroceden con la flecha (`onBack`). Cambiar Tipo resetea el form y vuelve al paso 1.
 * @returns  JSX — bottom sheet slide-up con el paso activo y su CTA.
 * @props    5: visible, item, onClose, onSave, onDelete
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
import { recurringFormFromItem, resetOnTipoChange } from './recurringFormHelpers';
import type { AgendaFilter, RecurringForm, RecurringDisplay, SaveRecurringData } from '../../types';

type StepKey = 'datos' | 'fecha' | 'cuotas' | 'jarra';
const STEPS: StepKey[] = ['datos', 'fecha', 'cuotas', 'jarra'];

type Props = {
  visible: boolean;
  item: RecurringDisplay | null;
  onClose: () => void;
  onSave: (data: SaveRecurringData) => void;
  onDelete: (id: string) => void;
};

export function EditRecurringSheet({ visible, item, onClose, onSave, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<RecurringForm | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (visible && item) { setForm(recurringFormFromItem(item)); setStepIndex(0); }
  }, [visible, item]);

  function setField<K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) {
    if (key === 'tipo') setStepIndex(0);
    setForm((prev) => {
      if (!prev) return prev;
      return key === 'tipo' ? resetOnTipoChange(prev, val as AgendaFilter) : { ...prev, [key]: val };
    });
  }

  if (!form) return null;

  const isDeuda      = form.tipo === 'deudas';
  const currentKey   = STEPS[stepIndex];
  const lastIndex    = STEPS.length - 1;
  const parsedMonto  = parseFloat(form.monto.replace(',', '.'));
  const canContinue  = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleSave() {
    if (!canContinue || !item || !form) return;
    onSave({
      id: item.id, name: form.nombre.trim(), amount: parsedMonto, day: form.dia, filter: form.tipo,
      jarra: form.jarra, frecuencia: form.frecuencia, cuotas: form.cuotasTotales,
      unicoPago: form.unicoPago, cuotasPagadas: form.cuotasPagadas,
    });
    onClose();
  }

  function handleDelete() {
    if (!item) return;
    onDelete(item.id);
    onClose();
  }

  return (
    <MoniSheet
      visible={visible}
      onClose={onClose}
      title="Editar compromiso"
      onBack={stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        {currentKey === 'datos' && <RecurringFormStep1 form={form} onChange={setField} lockTipo />}
        {currentKey === 'fecha' && <RecurringDayStep form={form} onChange={setField} />}
        {currentKey === 'cuotas' && (isDeuda
          ? <RecurringInstallmentsStep form={form} onChange={setField} />
          : <RecurringDurationStep form={form} onChange={setField} />
        )}
        {currentKey === 'jarra' && <RecurringJarSelector jarra={form.jarra} onChange={(v) => setField('jarra', v)} />}
        {stepIndex < lastIndex
          ? <MoniButton label="Continuar" onPress={() => setStepIndex(stepIndex + 1)} disabled={!canContinue} />
          : <MoniButton label="Guardar cambios" onPress={handleSave} disabled={!canContinue} />
        }
        {stepIndex === 0 && <MoniButton label="Cancelar compromiso" onPress={handleDelete} variant="danger" />}
      </ScrollView>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd, paddingBottom: spacing.stackLg },
});
