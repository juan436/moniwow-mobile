/**
 * EditRecurringModal — Component
 *
 * @what     Modal formulario en 2 pasos para editar o eliminar un recurrente existente.
 * @receives 5 props: visible, item, onClose, onSave, onDelete
 * @processes Paso 1 (RecurringFormStep1): tipo + nombre + monto + "Eliminar" (acceso rápido, no
 *           obliga a pasar por el paso 2 solo para borrar). Paso 2 (RecurringFormStep2): día/mes +
 *           frecuencia o cuotas + jarra + "Guardar cambios". Mismo patrón de pasos que
 *           CreateRecurringModal. Sheet sube con el teclado (Keyboard listeners + marginBottom),
 *           mismo comportamiento que TransferSheet. Cambiar Tipo resetea nombre/monto/frecuencia/
 *           cuotas a su default — "Nombre" y "Acreedor" son el mismo campo con significado
 *           distinto, y el monto tampoco debe sobrevivir al cambiar de tipo.
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
import { RecurringFormStep2 } from './RecurringFormStep2';
import type { AgendaFilter, RecurringForm, RecurringDisplay, SaveRecurringData } from '../../types';

function formFromItem(item: RecurringDisplay): RecurringForm {
  return { tipo: item.filter, nombre: item.name, monto: item.amount.toString(), dia: item.day, mes: 1, frecuencia: 'indefinido', cuotasTotales: 12, cuotasPagadas: 0, jarra: 'libre' };
}

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
  const [step, setStep] = useState<1 | 2>(1);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    if (visible && item) { setForm(formFromItem(item)); setStep(1); }
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
    setForm((prev) => {
      if (!prev) return prev;
      if (key === 'tipo') {
        return { ...prev, tipo: val as AgendaFilter, nombre: '', monto: '', frecuencia: 'indefinido', cuotasTotales: 12, cuotasPagadas: 0 };
      }
      return { ...prev, [key]: val };
    });
  }

  if (!form) return null;

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const canContinue = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleHeaderIcon() {
    if (step === 2) setStep(1);
    else onClose();
  }

  function handleSave() {
    if (!canContinue || !item || !form) return;
    onSave({ id: item.id, name: form.nombre.trim(), amount: parsedMonto, day: form.dia, filter: form.tipo });
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
              <MaterialIcons name={step === 2 ? 'arrow-back' : 'close'} size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            {step === 1 ? (
              <>
                <RecurringFormStep1 form={form} onChange={setField} />
                <MoniButton label="Continuar" onPress={() => setStep(2)} disabled={!canContinue} />
                <MoniButton label="Eliminar compromiso" onPress={handleDelete} variant="danger" />
              </>
            ) : (
              <>
                <RecurringFormStep2 form={form} onChange={setField} />
                <MoniButton label="Guardar cambios" onPress={handleSave} disabled={!canContinue} />
              </>
            )}
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
