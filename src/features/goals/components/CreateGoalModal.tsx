/**
 * CreateGoalModal — Component
 *
 * @what     Modal bottom sheet para crear nueva meta (M10).
 * @receives 3 props: visible, onClose, onCreate
 * @processes Form local: nombre, emoji, monto objetivo. Valida nombre + emoji + monto > 0. Sheet
 *           fijo abajo (el header nunca sube, para no solaparse con el status bar) — el ScrollView
 *           interno gana `paddingBottom` extra igual al alto del teclado para poder scrollear el
 *           campo tapado hasta dejarlo visible, sin mover el sheet.
 * @returns  JSX — bottom sheet con campos, emoji grid y CTA.
 * @props    3: visible, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, Keyboard, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton, EmojiPicker } from '@shared/components';
import type { CreateGoalData } from '../types';

type Form = { nombre: string; emoji: string; monto: string };
function emptyForm(): Form { return { nombre: '', emoji: '', monto: '' }; }

type Props = { visible: boolean; onClose: () => void; onCreate: (data: CreateGoalData) => void };

export function CreateGoalModal({ visible, onClose, onCreate }: Props) {
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
  const canSave = form.nombre.trim() !== '' && form.emoji !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleSave() {
    if (!canSave) return;
    onCreate({ name: form.nombre.trim(), icon: form.emoji, targetAmount: parsedMonto });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Nueva meta</Text>
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
              label="Nombre de la meta"
              value={form.nombre}
              onChangeText={(v) => setField('nombre', v)}
              placeholder="ej. Mi Carro Nuevo"
            />
            <MoniInput
              label="Monto objetivo ($)"
              value={form.monto}
              onChangeText={(v) => setField('monto', v)}
              placeholder="10000"
              inputType="numeric"
            />
            <EmojiPicker value={form.emoji} onChange={(v) => setField('emoji', v)} accentColor={colors.goldDreams} accentTint={colors.goldTint} />
            <MoniButton label="Añadir" onPress={handleSave} disabled={!canSave} variant="secondary" />
          </ScrollView>
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:    { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card * 1, borderTopRightRadius: radius.card * 1, maxHeight: '90%' },
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
