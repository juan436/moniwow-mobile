/**
 * CreateListModal — Component
 *
 * @what     Modal bottom sheet para crear una nueva lista de compras.
 * @receives 2 props: visible, onClose
 * @processes Form local: nombre, emoji, jarra. Valida nombre no vacío.
 * @returns  JSX — bottom sheet slide-up con campos, selector jarra y CTA.
 * @props    2: visible, onClose
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton } from '@shared/components';

const EMOJI_SIZE = 48;
const EMOJI_GAP  = 8;

const EMOJIS = [
  '🛒', '🛍️', '🍎', '🥦', '🥩', '🍞',
  '🧴', '🧹', '💊', '🐾', '🎁', '🍕',
  '☕', '🎮', '📚', '👗', '🔧', '🌱',
  '💄', '🏋️', '🎨', '🎵', '✈️', '🏖️',
  '🍽️', '🧸', '💡', '🌿', '👶', '🏠',
];

const JARRAS = [
  { key: 'hogar',       label: '🏠 Hogar'       },
  { key: 'ahorro',      label: '💰 Ahorro'      },
  { key: 'libre',       label: '🍃 Libre'       },
  { key: 'transporte',  label: '🚗 Transporte'  },
  { key: 'salud',       label: '❤️ Salud'       },
  { key: 'educacion',   label: '📚 Educación'   },
  { key: 'viajes',      label: '✈️ Viajes'      },
  { key: 'emergencias', label: '🛡️ Emergencias' },
  { key: 'ocio',        label: '🎮 Ocio'        },
];

type Form = { nombre: string; emoji: string; jarra: string };
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
            <View style={styles.block}>
              <Text style={styles.fieldLabel}>Jarra</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jarraRow}>
                {JARRAS.map((j) => (
                  <Pressable key={j.key} style={[styles.jarraItem, form.jarra === j.key && styles.jarraActive]} onPress={() => setField('jarra', j.key)}>
                    <Text style={[styles.jarraText, form.jarra === j.key && styles.jarraTextActive]}>{j.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
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
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card * 2, borderTopRightRadius: radius.card * 2, maxHeight: '90%' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackMd, marginBottom: spacing.stackSm },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackMd,
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
  jarraRow:       { flexDirection: 'row', gap: spacing.stackSm },
  jarraItem:      { paddingVertical: spacing.stackSm, paddingHorizontal: spacing.gutter, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  jarraActive:    { backgroundColor: colors.navyDark, borderColor: colors.navyDark },
  jarraText:      { ...typography.labelMd, color: colors.slateGray },
  jarraTextActive: { color: colors.pureWhite },
});
