/**
 * MoniInput — Component
 *
 * @what     Campo de texto estilizado del design system.
 * @receives 5 props: value, onChangeText, placeholder?, label?, inputType?
 * @processes Maneja estado de foco. inputType controla secureTextEntry y keyboardType.
 * @returns  JSX — TextInput con label opcional, h=56, radius=16.
 * @props    5: value, onChangeText, placeholder?, label?, inputType?
 */
import { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../styles';

type InputType = 'text' | 'email' | 'password' | 'numeric';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  inputType?: InputType;
};

export function MoniInput({ value, onChangeText, placeholder, label, inputType = 'text' }: Props) {
  const [focused, setFocused] = useState(false);

  const isPassword = inputType === 'password';
  const isEmail    = inputType === 'email';
  const isNumeric  = inputType === 'numeric';

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outlineVariant}
        secureTextEntry={isPassword}
        keyboardType={isEmail ? 'email-address' : isNumeric ? 'numeric' : 'default'}
        autoCapitalize={isPassword || isEmail ? 'none' : 'sentences'}
        autoCorrect={!isPassword && !isEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.stackXs,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  input: {
    height: spacing.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    backgroundColor: colors.pureWhite,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: colors.emeraldSuccess,
  },
});
