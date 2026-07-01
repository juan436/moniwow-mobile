/**
 * CreateJarModal — Component
 *
 * @what     Modal bottom sheet para crear una jarra nueva: nombre + emoji.
 * @receives 3 props: visible, onClose, onCreate
 * @processes Form local: nombre, emoji. Valida nombre no vacío + emoji elegido.
 * @returns  JSX — bottom sheet con campo nombre, emoji grid y CTA.
 * @props    3: visible, onClose, onCreate
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton } from '@shared/components';
import type { CreateJarData } from '../types';

const EMOJI_SIZE = 48;
const EMOJI_GAP  = 8;

const JAR_EMOJIS = [
  '💰', '🏠', '🍃', '🚗', '✈️', '💻',
  '📱', '🎓', '💍', '🏖️', '🎸', '📷',
  '🏋️', '🚀', '🌍', '🎮', '👗', '🎉',
  '🌱', '🏄', '🎨', '📚', '🐕', '🛵',
];

type Form = { nombre: string; emoji: string };
function emptyForm(): Form { return { nombre: '', emoji: '' }; }

type Props = { visible: boolean; onClose: () => void; onCreate: (data: CreateJarData) => void };

export function CreateJarModal({ visible, onClose, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>(emptyForm);

  useEffect(() => { if (visible) setForm(emptyForm()); }, [visible]);

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const canSave = form.nombre.trim() !== '' && form.emoji !== '';

  function handleSave() {
    if (!canSave) return;
    onCreate({ name: form.nombre.trim(), emoji: form.emoji });
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
            contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
            <MoniInput
              label="Nombre de la jarra"
              value={form.nombre}
              onChangeText={(v) => setField('nombre', v)}
              placeholder="ej. Vacaciones"
            />
            <View style={styles.block}>
              <Text style={styles.fieldLabel}>Elige un emoji</Text>
              <ScrollView style={styles.emojiGridScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                <View style={styles.emojiGrid}>
                  {JAR_EMOJIS.map((emoji) => (
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
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card * 2, borderTopRightRadius: radius.card * 2, maxHeight: '90%' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackMd, marginBottom: spacing.stackSm },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackMd,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  title:           { ...typography.headlineMd, color: colors.navyDark },
  body:            { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
  block:           { gap: spacing.stackXs },
  fieldLabel:      { ...typography.labelSm, color: colors.onSurfaceVariant },
  emojiGridScroll: { height: EMOJI_SIZE * 2 + EMOJI_GAP },
  emojiGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: EMOJI_GAP },
  emojiItem:       { width: EMOJI_SIZE, height: EMOJI_SIZE, borderRadius: radius.md, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  emojiItemActive: { borderColor: colors.emeraldSuccess, backgroundColor: colors.emeraldTint },
  emojiGlyph:      { fontSize: 24, includeFontPadding: false },
});
