/**
 * CreateListModal — Component
 *
 * @what     Modal bottom sheet para crear una nueva lista de compras.
 * @receives 2 props: visible, onClose
 * @processes Form local: nombre, emoji, jarra. Valida nombre no vacío. Jarra usa
 *           RecurringJarSelector (MaterialIcons reales) — antes tenía su propio set de emoji
 *           Unicode embebido en el label, inconsistente con el resto de la app.
 * @returns  JSX — bottom sheet slide-up con campos, selector jarra y CTA.
 * @props    2: visible, onClose
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton } from '@shared/components';
import { RecurringJarSelector } from '../recurring/RecurringJarSelector';
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

type Form = { nombre: string; emoji: string; jarra: RecurringJar };
function emptyForm(): Form { return { nombre: '', emoji: '', jarra: 'libre' }; }

type Props = { visible: boolean; onClose: () => void };

export function CreateListModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>(emptyForm);

  useEffect(() => { if (visible) setForm(emptyForm()); }, [visible]);

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
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Nueva lista</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
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
            <RecurringJarSelector jarra={form.jarra} onChange={(v) => setField('jarra', v)} />
            <MoniButton label="Añadir" onPress={handleSave} disabled={!canSave} />
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
  title:      { ...typography.headlineMd, color: colors.navyDark },
  body:       { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  emojiGridScroll: { height: EMOJI_SIZE * 2 + EMOJI_GAP },
  emojiGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: EMOJI_GAP },
  emojiItem:     { width: EMOJI_SIZE, height: EMOJI_SIZE, borderRadius: radius.md, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  emojiItemActive: { borderColor: colors.navyDark, backgroundColor: colors.navyDark + '18' },
  emojiGlyph:    { fontSize: 24, includeFontPadding: false },
});
