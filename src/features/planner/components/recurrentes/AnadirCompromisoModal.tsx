/**
 * AnadirCompromisoModal — Component
 *
 * @what     Modal formulario para crear un recurrente nuevo: Ingreso, Gasto o Deuda.
 * @receives 4 props: visible, initialType, onClose, onCreate
 * @processes Form local. Tipo pre-seleccionado por initialType. Campos vía CompromisoFormFields.
 * @returns  JSX — bottom sheet slide-up con CompromisoFormFields y CTA.
 * @props    4: visible, initialType, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { CompromisoFormFields } from './CompromisoFormFields';
import type { AgendaFilter, NuevoCompromisoForm, CreateRecurrenteData } from '../../types';

function emptyForm(tipo: AgendaFilter): NuevoCompromisoForm {
  return { tipo, nombre: '', monto: '', dia: 1, mes: 1, frecuencia: 'indefinido', cuotasTotales: 12, cuotasPagadas: 0, jarra: 'libre' };
}

type Props = { visible: boolean; initialType: AgendaFilter; onClose: () => void; onCreate: (data: CreateRecurrenteData) => void };

export function AnadirCompromisoModal({ visible, initialType, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<NuevoCompromisoForm>(() => emptyForm(initialType));

  useEffect(() => { if (visible) setForm(emptyForm(initialType)); }, [visible, initialType]);

  function setField<K extends keyof NuevoCompromisoForm>(key: K, val: NuevoCompromisoForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const canSave     = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleSave() {
    if (!canSave) return;
    onCreate({ name: form.nombre.trim(), amount: parsedMonto, day: form.dia, filter: form.tipo });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Programar compromiso</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            <CompromisoFormFields form={form} onChange={setField} />
            <MoniButton label="Programar compromiso" onPress={handleSave} disabled={!canSave} />
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
    borderTopLeftRadius: radius.card * 2,
    borderTopRightRadius: radius.card * 2,
    maxHeight: '90%',
  },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackMd, marginBottom: spacing.stackSm },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackMd,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  sheetTitle: { ...typography.headlineMd, color: colors.navyDark },
  body:       { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd, paddingBottom: spacing.stackLg },
});
