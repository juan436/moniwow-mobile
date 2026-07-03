/**
 * CreateItemModal — Component
 *
 * @what     Modal bottom sheet para añadir un ítem a una lista existente.
 * @receives 4 props: visible, listaId, listaName, onClose
 * @processes Form local: nombre (requerido), montoAprox (opcional). Valida nombre no vacío.
 * @returns  JSX — bottom sheet slide-up con campos y CTA.
 * @props    4: visible, listaId, listaName, onClose
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, ScrollView, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton } from '@shared/components';

type Form = { nombre: string; montoAprox: string };
function emptyForm(): Form { return { nombre: '', montoAprox: '' }; }

type Props = { visible: boolean; listaId: string; listaName: string; onClose: () => void };

export function CreateItemModal({ visible, listaName, onClose }: Props) {
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

  const canSave = form.nombre.trim() !== '';

  function handleSave() {
    if (!canSave) return;
    // TODO: conectar use-case cuando backend listo
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheet, { marginBottom: kbHeight }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>Añadir a {listaName}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            <MoniInput label="Nombre del ítem" value={form.nombre} onChangeText={(v) => setField('nombre', v)} placeholder="ej. Leche" />
            <View style={styles.block}>
              <Text style={styles.fieldLabel}>Monto aproximado <Text style={styles.optional}>(opcional)</Text></Text>
              <TextInput
                style={styles.numInput}
                value={form.montoAprox}
                onChangeText={(v) => setField('montoAprox', v)}
                placeholder="$ 0.00"
                placeholderTextColor={colors.outlineVariant}
                keyboardType="numeric"
              />
            </View>
            <MoniButton label="Añadir ítem" onPress={handleSave} disabled={!canSave} />
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
  title:      { ...typography.headlineMd, color: colors.navyDark, flex: 1, marginRight: spacing.stackSm },
  body:       { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  optional:   { ...typography.labelSm, color: colors.outlineVariant },
  numInput: {
    height: spacing.inputHeight, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, backgroundColor: colors.pureWhite,
    textAlignVertical: 'center', includeFontPadding: false,
  },
});
