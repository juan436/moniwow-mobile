/**
 * EmojiPicker — Component
 *
 * @what     Grid de emojis seleccionables, compartido entre Jarras y Metas (antes duplicado con
 *           dos listas distintas — JAR_EMOJIS y GOAL_EMOJIS — causaba inconsistencia visual).
 * @receives 4 props: value, onChange, accentColor?, accentTint?
 * @processes Grid scrolleable 6 columnas, resalta el emoji activo con accentColor/accentTint
 *           (por defecto emeraldSuccess — Metas pasa goldDreams/goldTint, único caso permitido de
 *           mezclar ese acento, ver visual-system.md).
 * @returns  JSX — label + ScrollView con grid de emojis.
 * @props    4: value, onChange, accentColor?, accentTint?
 */
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '../styles';

const EMOJI_SIZE = 48;
const EMOJI_GAP  = 8;

const EMOJIS = [
  '💰', '🏠', '🍃', '🚗', '✈️', '💻',
  '📱', '🎓', '💍', '🏖️', '🎸', '📷',
  '🏋️', '🚀', '🌍', '🎮', '👗', '🎉',
  '🌱', '🏄', '🎨', '📚', '🐕', '🛵',
];

type Props = { value: string; onChange: (emoji: string) => void; accentColor?: string; accentTint?: string };

export function EmojiPicker({ value, onChange, accentColor = colors.emeraldSuccess, accentTint = colors.emeraldTint }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.fieldLabel}>Elige un emoji</Text>
      <ScrollView style={styles.emojiGridScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={styles.emojiGrid}>
          {EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              style={[styles.emojiItem, value === emoji && { borderColor: accentColor, backgroundColor: accentTint }]}
              onPress={() => onChange(emoji)}
            >
              <Text style={styles.emojiGlyph}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block:           { gap: spacing.stackXs },
  fieldLabel:      { ...typography.labelSm, color: colors.onSurfaceVariant },
  emojiGridScroll: { height: EMOJI_SIZE * 2 + EMOJI_GAP },
  emojiGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: EMOJI_GAP },
  emojiItem:       { width: EMOJI_SIZE, height: EMOJI_SIZE, borderRadius: radius.md, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  emojiGlyph:      { fontSize: 24, includeFontPadding: false },
});
