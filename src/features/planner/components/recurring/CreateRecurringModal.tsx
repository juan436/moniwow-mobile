/**
 * CreateRecurringModal — Component
 *
 * @what     Modal formulario en 2 pasos para crear un recurrente nuevo: Ingreso, Gasto o Deuda.
 * @receives 4 props: visible, initialType, onClose, onCreate
 * @processes Paso 1 (RecurringFormStep1): tipo + nombre + monto. Paso 2 (RecurringFormStep2):
 *           día/mes + frecuencia o cuotas + jarra de pago. El ícono del header cambia de "cerrar"
 *           (paso 1) a "atrás" (paso 2) — atrás en paso 2 vuelve a paso 1, no cierra el modal.
 *           Formulario largo dividido para no scrollear 7 campos de una — mismo espíritu que
 *           Quick Add / Registro de Ingreso (monto → destino). Sheet sube con el teclado
 *           (Keyboard listeners + marginBottom), mismo comportamiento que TransferSheet. Cambiar
 *           Tipo resetea nombre/monto/frecuencia/cuotas a su default — "Nombre" y "Acreedor" son
 *           el mismo campo con significado distinto, y el monto tampoco debe sobrevivir al
 *           cambiar de tipo.
 * @returns  JSX — bottom sheet slide-up con el paso activo y su CTA.
 * @props    4: visible, initialType, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { RecurringFormStep1 } from './RecurringFormStep1';
import { RecurringFormStep2 } from './RecurringFormStep2';
import type { AgendaFilter, RecurringForm, CreateRecurringData } from '../../types';

function emptyForm(tipo: AgendaFilter): RecurringForm {
  return { tipo, nombre: '', monto: '', dia: 1, mes: 1, frecuencia: 'indefinido', cuotasTotales: 12, cuotasPagadas: 0, jarra: 'libre' };
}

type Props = { visible: boolean; initialType: AgendaFilter; onClose: () => void; onCreate: (data: CreateRecurringData) => void };

export function CreateRecurringModal({ visible, initialType, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<RecurringForm>(() => emptyForm(initialType));
  const [step, setStep] = useState<1 | 2>(1);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    if (visible) { setForm(emptyForm(initialType)); setStep(1); }
  }, [visible, initialType]);

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
      if (key === 'tipo') {
        return { ...prev, tipo: val as AgendaFilter, nombre: '', monto: '', frecuencia: 'indefinido', cuotasTotales: 12, cuotasPagadas: 0 };
      }
      return { ...prev, [key]: val };
    });
  }

  const parsedMonto  = parseFloat(form.monto.replace(',', '.'));
  const canContinue  = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleHeaderIcon() {
    if (step === 2) setStep(1);
    else onClose();
  }

  function handleSave() {
    if (!canContinue) return;
    onCreate({ name: form.nombre.trim(), amount: parsedMonto, day: form.dia, filter: form.tipo });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheet, { marginBottom: kbHeight }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Programar compromiso</Text>
            <Pressable onPress={handleHeaderIcon} hitSlop={8}>
              <MaterialIcons name={step === 2 ? 'arrow-back' : 'close'} size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            {step === 1
              ? <RecurringFormStep1 form={form} onChange={setField} />
              : <RecurringFormStep2 form={form} onChange={setField} />
            }
            {step === 1
              ? <MoniButton label="Continuar" onPress={() => setStep(2)} disabled={!canContinue} />
              : <MoniButton label="Programar compromiso" onPress={handleSave} disabled={!canContinue} />
            }
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
