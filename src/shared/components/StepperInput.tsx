/**
 * StepperInput — Component
 *
 * @what     Campo numérico con botones +/- Y escritura directa para valores enteros acotados.
 * @receives 5 props: label, value, min, max, onChange
 * @processes Botones clampean en límites. Input directo: propaga al parsear, clampea al blur.
 * @returns  JSX — label + fila [-] [TextInput editable] [+].
 * @props    5: label, value, min, max, onChange
 */
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';

type Props = {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  onChange: (v: number) => void;
};

export function StepperInput({ label, value, min, max, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const atMin = value <= min;
  const atMax = value >= max;

  function handleChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setDraft(digits);
    const n = parseInt(digits, 10);
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  }

  function handleBlur() {
    const n = parseInt(draft ?? '', 10);
    onChange(isNaN(n) ? min : Math.min(max, Math.max(min, n)));
    setDraft(null);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          style={styles.btn}
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          hitSlop={8}
        >
          <MaterialIcons name="remove" size={18} color={atMin ? colors.outlineVariant : colors.navyDark} />
        </Pressable>
        <TextInput
          style={styles.val}
          value={draft ?? value.toString()}
          onChangeText={handleChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          selectTextOnFocus
          maxLength={3}
        />
        <Pressable
          style={styles.btn}
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
          hitSlop={8}
        >
          <MaterialIcons name="add" size={18} color={atMax ? colors.outlineVariant : colors.navyDark} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.stackXs },
  label:   { ...typography.labelSm, color: colors.onSurfaceVariant },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.pureWhite,
    overflow: 'hidden',
  },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  val: {
    flex: 2,
    textAlign: 'center',
    ...typography.bodyMd,
    color: colors.onSurface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.outlineVariant,
    includeFontPadding: false,
    textAlignVertical: 'center',
    padding: 0,
  },
});
