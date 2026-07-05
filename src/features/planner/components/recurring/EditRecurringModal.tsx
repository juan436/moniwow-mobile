/**
 * EditRecurringModal — Component
 *
 * @what     Modal formulario para editar o eliminar un recurrente existente. Siempre 4 pasos, uno
 *           por pregunta — mismo patrón que CreateRecurringModal.
 * @receives 5 props: visible, item, onClose, onSave, onDelete
 * @processes Paso 1: tipo + nombre + monto + "Eliminar" (acceso rápido, no obliga a pasar por los
 *           pasos siguientes solo para borrar). Mismos 4 pasos que CreateRecurringModal, contenido
 *           cambia según tipo. Sheet sube con el teclado (Keyboard listeners + marginBottom),
 *           mismo comportamiento que TransferSheet. Cambiar Tipo resetea el form y vuelve al
 *           paso 1.
 * @returns  JSX — bottom sheet slide-up con el paso activo y su CTA.
 * @props    5: visible, item, onClose, onSave, onDelete
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { RecurringFormStep1 } from './RecurringFormStep1';
import { RecurringDayStep } from './RecurringDayStep';
import { RecurringDurationStep } from './RecurringDurationStep';
import { RecurringPaymentDateStep } from './RecurringPaymentDateStep';
import { RecurringInstallmentsStep } from './RecurringInstallmentsStep';
import { RecurringJarSelector } from './RecurringJarSelector';
import { recurringFormFromItem, resetOnTipoChange, primaryDay } from './recurringFormHelpers';
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

export function EditRecurringModal({ visible, item, onClose, onSave, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<RecurringForm | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    if (visible && item) { setForm(recurringFormFromItem(item)); setStepIndex(0); }
  }, [visible, item]);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKbHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKbHeight(0),
    );
    return () => { show.remove(); hide.remove(); };
  }, []);

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

  function handleHeaderIcon() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else onClose();
  }

  function handleSave() {
    if (!canContinue || !item || !form) return;
    onSave({ id: item.id, name: form.nombre.trim(), amount: parsedMonto, day: primaryDay(form), filter: form.tipo });
    onClose();
  }

  function handleDelete() {
    if (!item) return;
    onDelete(item.id);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheet, { marginBottom: kbHeight }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Editar compromiso</Text>
            <Pressable onPress={handleHeaderIcon} hitSlop={8}>
              <MaterialIcons name={stepIndex > 0 ? 'arrow-back' : 'close'} size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            {currentKey === 'datos' && <RecurringFormStep1 form={form} onChange={setField} lockTipo />}
            {currentKey === 'fecha' && (isDeuda
              ? <RecurringPaymentDateStep form={form} onChange={setField} />
              : <RecurringDayStep form={form} onChange={setField} />
            )}
            {currentKey === 'cuotas' && (isDeuda
              ? <RecurringInstallmentsStep form={form} onChange={setField} />
              : <RecurringDurationStep form={form} onChange={setField} />
            )}
            {currentKey === 'jarra' && <RecurringJarSelector jarra={form.jarra} onChange={(v) => setField('jarra', v)} />}
            {stepIndex < lastIndex
              ? <MoniButton label="Continuar" onPress={() => setStepIndex(stepIndex + 1)} disabled={!canContinue} />
              : <MoniButton label="Guardar cambios" onPress={handleSave} disabled={!canContinue} />
            }
            {stepIndex === 0 && <MoniButton label="Eliminar compromiso" onPress={handleDelete} variant="danger" />}
          </ScrollView>
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet: {
    backgroundColor: colors.pureWhite,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    maxHeight: '90%',
  },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackSm, marginBottom: spacing.stackXs },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackXs, paddingBottom: spacing.stackSm,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  sheetTitle: { ...typography.headlineMd, color: colors.navyDark },
  body:       { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd, paddingBottom: spacing.stackLg },
});
