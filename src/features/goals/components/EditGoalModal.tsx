/**
 * EditGoalModal — Component
 *
 * @what     Modal bottom sheet para editar o eliminar una meta existente (M10).
 * @receives 5 props: visible, goal, onClose, onSave, onDelete
 * @processes Pre-llena form con goal activo. Valida nombre + emoji + monto > 0. El chrome (sheet +
 *           backdrop + header + teclado) lo pone `MoniSheet`; acá solo viven los campos.
 * @returns  JSX — bottom sheet con campos pre-llenados, CTA guardar y botón eliminar peligro.
 * @props    5: visible, goal, onClose, onSave, onDelete
 */
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@shared/styles';
import { MoniInput, MoniButton, EmojiPicker, MoniSheet } from '@shared/components';
import type { GoalItem, SaveGoalData } from '../types';

type Form = { nombre: string; emoji: string; monto: string };

type Props = {
  visible: boolean;
  goal: GoalItem | null;
  onClose: () => void;
  onSave: (data: SaveGoalData) => void;
  onDelete: (id: string) => void;
};

export function EditGoalModal({ visible, goal, onClose, onSave, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>({ nombre: '', emoji: '', monto: '' });

  useEffect(() => {
    if (visible && goal) {
      setForm({ nombre: goal.name, emoji: goal.emoji, monto: goal.target.toString() });
    }
  }, [visible, goal]);

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const parsedMonto = parseFloat(form.monto.replace(',', '.'));
  const canSave = form.nombre.trim() !== '' && form.emoji !== '' && !isNaN(parsedMonto) && parsedMonto > 0;

  function handleSave() {
    if (!canSave || !goal) return;
    onSave({ id: goal.id, name: form.nombre.trim(), icon: form.emoji, targetAmount: parsedMonto });
    onClose();
  }

  function handleDelete() {
    if (!goal) return;
    onDelete(goal.id);
    onClose();
  }

  return (
    <MoniSheet visible={visible} onClose={onClose} title="Editar meta">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <MoniInput label="Nombre de la meta" value={form.nombre} onChangeText={(v) => setField('nombre', v)} placeholder="ej. Mi Carro Nuevo" />
        <MoniInput label="Monto objetivo ($)" value={form.monto} onChangeText={(v) => setField('monto', v)} placeholder="10000" inputType="numeric" />
        <EmojiPicker value={form.emoji} onChange={(v) => setField('emoji', v)} accentColor={colors.goldDreams} accentTint={colors.goldTint} />
        <MoniButton label="Guardar cambios" onPress={handleSave} disabled={!canSave} variant="secondary" />
        <MoniButton label="Eliminar meta" onPress={handleDelete} variant="danger" />
      </ScrollView>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
});
