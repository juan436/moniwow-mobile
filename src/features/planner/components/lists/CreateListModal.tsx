/**
 * CreateListModal — Component
 *
 * @what     Asistente 3 pasos para crear una lista de compras: P1 nombre + emoji, P2 jarra de pago,
 *           P3 preview + confirmar.
 * @receives 2 props: visible, onClose
 * @processes Form local (nombre, emoji, jarra) + `step` (0..2). Chrome/teclado/dots en WizardSheet.
 *           P1 valida nombre no vacío. Jarra usa RecurringJarSelector (MaterialIcons reales).
 * @returns  JSX — WizardSheet con los 3 pasos.
 * @props    2: visible, onClose
 */
import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton, WizardSheet } from '@shared/components';
import { RecurringJarSelector } from '../recurring/RecurringJarSelector';
import { ListPreview } from './ListPreview';
import type { RecurringJar } from '../../types';

const EMOJI_SIZE = 48;
const EMOJI_GAP  = 8;

const EMOJIS = [
  '🛒', '🛍️', '🍎', '🥦', '🥩', '🍞',
  '🧴', '🧹', '💊', '🐾', '🎁', '🍕',
  '☕', '🎮', '📚', '👗', '🔧', '🌱',
  '💄', '🏋️', '🎨', '🎵', '✈️', '🏖️',
  '🍽️', '🧸', '💡', '🌿', '👶', '🏠',
];

const TITLES = ['Nueva lista', '¿De qué jarra sale?', 'Confirmar'];

type Form = { nombre: string; emoji: string; jarra: RecurringJar };
function emptyForm(): Form { return { nombre: '', emoji: '', jarra: 'libre' }; }

type Props = { visible: boolean; onClose: () => void };

export function CreateListModal({ visible, onClose }: Props) {
  const [form, setForm] = useState<Form>(emptyForm);
  const [step, setStep] = useState(0);

  useEffect(() => { if (visible) { setForm(emptyForm()); setStep(0); } }, [visible]);

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const step1Ok = form.nombre.trim() !== '';

  function handleSave() {
    if (!step1Ok) return;
    // TODO: conectar use-case cuando backend listo
    onClose();
  }

  const footer =
    step === 0 ? <MoniButton label="Siguiente" onPress={() => setStep(1)} disabled={!step1Ok} />
    : step === 1 ? <MoniButton label="Siguiente" onPress={() => setStep(2)} />
    : <MoniButton label="Añadir" onPress={handleSave} />;

  return (
    <WizardSheet
      visible={visible}
      onClose={onClose}
      header={{ title: TITLES[step], step, stepCount: 3, onBack: step > 0 ? () => setStep(step - 1) : undefined }}
      footer={footer}
    >
      {step === 0 && (
        <>
          <MoniInput label="Nombre" value={form.nombre} onChangeText={(v) => setField('nombre', v)} placeholder="ej. Supermercado" />
          <View style={styles.block}>
            <Text style={styles.fieldLabel}>Emoji</Text>
            <ScrollView style={styles.emojiGridScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
              <View style={styles.emojiGrid}>
                {EMOJIS.map((emoji) => (
                  <Pressable
                    key={emoji}
                    style={[styles.emojiItem, form.emoji === emoji && styles.emojiItemActive]}
                    onPress={() => setField('emoji', emoji)}
                  >
                    <Text style={styles.emojiGlyph}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </>
      )}
      {step === 1 && <RecurringJarSelector jarra={form.jarra} onChange={(v) => setField('jarra', v)} />}
      {step === 2 && <ListPreview nombre={form.nombre} emoji={form.emoji} jarra={form.jarra} />}
    </WizardSheet>
  );
}

const styles = StyleSheet.create({
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  emojiGridScroll: { height: EMOJI_SIZE * 2 + EMOJI_GAP },
  emojiGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: EMOJI_GAP },
  emojiItem:     { width: EMOJI_SIZE, height: EMOJI_SIZE, borderRadius: radius.md, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  emojiItemActive: { borderColor: colors.emeraldSuccess, backgroundColor: colors.emeraldTint },
  emojiGlyph:    { fontSize: 24, includeFontPadding: false },
});
