/**
 * CreateRecurringModal — Component
 *
 * @what     Modal formulario para crear un recurrente nuevo: Ingreso, Gasto o Deuda. Siempre 4
 *           pasos, uno por pregunta — más liviano que amontonar toggles en una sola pantalla.
 * @receives 4 props: visible, initialType, onClose, onCreate
 * @processes Secuencia (mismos 4 pasos, contenido cambia según tipo): RecurringFormStep1 (datos) →
 *           RecurringDayStep (Ingreso/Gasto, ¿qué día se cobra/paga?) o RecurringPaymentDateStep
 *           (Deuda, ¿qué día se paga? + link a calendario por mes) → RecurringDurationStep
 *           (Ingreso/Gasto, ¿tiene fecha de fin?) o RecurringInstallmentsStep (Deuda, ¿cuántas
 *           cuotas tiene?) → RecurringJarSelector. El ícono del header retrocede un paso; en el
 *           primero cierra el modal. Sheet sube con el teclado (Keyboard listeners + marginBottom),
 *           mismo comportamiento que TransferSheet. Cambiar Tipo resetea nombre/monto/frecuencia/
 *           fecha/cuotas a su default y vuelve al paso 1 — "Nombre" y "Acreedor" son el mismo
 *           campo con significado distinto.
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
import { RecurringDayStep } from './RecurringDayStep';
import { RecurringDurationStep } from './RecurringDurationStep';
import { RecurringPaymentDateStep } from './RecurringPaymentDateStep';
import { RecurringInstallmentsStep } from './RecurringInstallmentsStep';
import { RecurringJarSelector } from './RecurringJarSelector';
import { emptyRecurringForm, resetOnTipoChange, primaryDay } from './recurringFormHelpers';
import type { AgendaFilter, RecurringForm, CreateRecurringData } from '../../types';

type StepKey = 'datos' | 'fecha' | 'cuotas' | 'jarra';
const STEPS: StepKey[] = ['datos', 'fecha', 'cuotas', 'jarra'];

type Props = { visible: boolean; initialType: AgendaFilter; onClose: () => void; onCreate: (data: CreateRecurringData) => void };

export function CreateRecurringModal({ visible, initialType, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<RecurringForm>(() => emptyRecurringForm(initialType));
  const [stepIndex, setStepIndex] = useState(0);
  const [kbHeight, setKbHeight] = useState(0);
  const isDeuda    = form.tipo === 'deudas';
  const currentKey = STEPS[stepIndex];
  const lastIndex  = STEPS.length - 1;

  useEffect(() => {
    if (visible) { setForm(emptyRecurringForm(initialType)); setStepIndex(0); }
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
    if (key === 'tipo') setStepIndex(0);
    setForm((prev) => key === 'tipo' ? resetOnTipoChange(prev, val as AgendaFilter) : { ...prev, [key]: val });
  }

  const parsedMonto  = parseFloat(form.monto.replace(',', '.'));
  const canContinue  = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleHeaderIcon() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else onClose();
  }

  function handleSave() {
    if (!canContinue) return;
    onCreate({
      name: form.nombre.trim(), amount: parsedMonto, day: primaryDay(form), filter: form.tipo,
      jarra: form.jarra, frecuencia: form.frecuencia, cuotas: form.cuotasTotales,
    });
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
              <MaterialIcons name={stepIndex > 0 ? 'arrow-back' : 'close'} size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            {currentKey === 'datos' && <RecurringFormStep1 form={form} onChange={setField} />}
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
