/**
 * EditRecurringModal — Component
 *
 * @what     Modal formulario para editar o eliminar un recurrente existente.
 * @receives 5 props: visible, item, onClose, onSave, onDelete
 * @processes Pre-llena form con item activo. Campos vía RecurringFormFields.
 * @returns  JSX — bottom sheet slide-up con RecurringFormFields, CTA y eliminar.
 * @props    5: visible, item, onClose, onSave, onDelete
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { RecurringFormFields } from './RecurringFormFields';
import type { RecurringForm, RecurringDisplay, SaveRecurringData } from '../../types';

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

  useEffect(() => { if (visible && item) setForm(formFromItem(item)); }, [visible, item]);

  function setField<K extends keyof RecurringForm>(key: K, val: RecurringForm[K]) {
    setForm((prev) => prev && ({ ...prev, [key]: val }));
  }

  if (!form) return null;

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const canSave     = form.nombre.trim() !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleSave() {
    if (!canSave || !item || !form) return;
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
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Editar compromiso</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            <RecurringFormFields form={form} onChange={setField} />
            <MoniButton label="Guardar cambios" onPress={handleSave} disabled={!canSave} />
            <MoniButton label="Eliminar compromiso" onPress={handleDelete} variant="danger" />
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
