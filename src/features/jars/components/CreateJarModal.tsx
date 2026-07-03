/**
 * CreateJarModal — Component
 *
 * @what     Modal bottom sheet para crear una jarra nueva: nombre + ícono + checkboxes Presupuesto
 *           y Blindado.
 * @receives 3 props: visible, onClose, onCreate
 * @processes Form local: nombre, ícono (MaterialIcons, mismo set que las jarras existentes —
 *           ver IconPicker), checkbox "Presupuesto" + monto si está marcado, checkbox "Blindado"
 *           (fricción/slider al transferir, ver TransferSheet). Sin Presupuesto → jarra sin barra
 *           de progreso (igual que Libre). Con Presupuesto → tipo presupuesto, igual que Hogar (ver
 *           JarDetailModal: progreso = presupuesto usado, no meta de ahorro). Valida nombre + ícono
 *           elegido + (monto > 0 si Presupuesto está marcado). Sheet fijo abajo (el header nunca
 *           sube, para no solaparse con el status bar) — el ScrollView interno gana `paddingBottom`
 *           extra igual al alto del teclado para scrollear el campo tapado sin mover el sheet
 *           (mismo patrón que CreateGoalModal/EditGoalModal).
 * @returns  JSX — bottom sheet con campo nombre, grid de íconos y CTA.
 * @props    3: visible, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton, IconPicker } from '@shared/components';
import { JarFlagsField } from './JarFlagsField';
import type { CreateJarData } from '../types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type Form = { nombre: string; iconName: IconName | null; tieneObjetivo: boolean; monto: string; isBlindado: boolean };
function emptyForm(): Form { return { nombre: '', iconName: null, tieneObjetivo: false, monto: '', isBlindado: false }; }

type Props = { visible: boolean; onClose: () => void; onCreate: (data: CreateJarData) => void };

export function CreateJarModal({ visible, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>(emptyForm);
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => { if (visible) setForm(emptyForm()); }, [visible]);

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

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const canSave = form.nombre.trim() !== '' && form.iconName !== null &&
    (!form.tieneObjetivo || (!isNaN(parsedMonto) && parsedMonto > 0));

  function handleSave() {
    if (!canSave || !form.iconName) return;
    onCreate({
      name: form.nombre.trim(),
      iconName: form.iconName,
      targetAmount: form.tieneObjetivo ? parsedMonto : undefined,
      isBlindado: form.isBlindado,
    });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Nueva jarra</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg + kbHeight }]}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
            <MoniInput
              label="Nombre de la jarra"
              value={form.nombre}
              onChangeText={(v) => setField('nombre', v)}
              placeholder="ej. Vacaciones"
            />
            <JarFlagsField
              presupuesto={{
                checked: form.tieneObjetivo, monto: form.monto,
                onToggle: () => setField('tieneObjetivo', !form.tieneObjetivo),
                onChangeMonto: (v) => setField('monto', v),
              }}
              blindado={{ checked: form.isBlindado, onToggle: () => setField('isBlindado', !form.isBlindado) }}
            />
            <IconPicker value={form.iconName} onChange={(v) => setField('iconName', v)} />
            <MoniButton label="Añadir" onPress={handleSave} disabled={!canSave} variant="primary" />
          </ScrollView>
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:    { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, maxHeight: '90%' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackSm, marginBottom: spacing.stackXs },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackXs, paddingBottom: spacing.stackSm,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  title:           { ...typography.headlineMd, color: colors.navyDark },
  body:            { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
});
