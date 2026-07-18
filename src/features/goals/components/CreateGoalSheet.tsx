/**
 * CreateGoalSheet — Component
 *
 * @what     Modal bottom sheet para crear nueva meta (M10).
 * @receives 3 props: visible, onClose, onCreate
 * @processes Form local: nombre, emoji, monto objetivo. Valida nombre + emoji + monto > 0. El chrome
 *           (sheet + backdrop + header + teclado) lo pone `MoniSheet`; acá solo viven los campos.
 * @returns  JSX — bottom sheet con campos, emoji grid y CTA.
 * @props    3: visible, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@shared/styles';
import { MoniInput, MoniButton, EmojiPicker, MoniSheet } from '@shared/components';
import type { CreateGoalData } from '../types';

type Form = { nombre: string; emoji: string; monto: string };
function emptyForm(): Form { return { nombre: '', emoji: '', monto: '' }; }

type Props = { visible: boolean; onClose: () => void; onCreate: (data: CreateGoalData) => void };

export function CreateGoalSheet({ visible, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>(emptyForm);

  useEffect(() => { if (visible) setForm(emptyForm()); }, [visible]);

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
    <MoniSheet visible={visible} onClose={onClose} title="Nueva meta">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
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
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
});
