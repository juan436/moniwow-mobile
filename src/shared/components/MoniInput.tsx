/**
 * MoniInput — Component
 *
 * @what     Campo de texto estilizado del design system.
 * @receives 8 props: value, onChangeText, placeholder?, label?, inputType?, disabled?, multiline?, numberOfLines?
 * @processes Maneja estado de foco. inputType controla secureTextEntry y keyboardType. `disabled`
 *           bloquea edición y atenúa (para campos que la regla de negocio no permite editar).
 *           `multiline` crece en alto en vez de mantener h=56 fijo (texto libre largo, ej. feedback).
 * @returns  JSX — TextInput con label opcional, h=56, radius=16.
 * @props    8: value, onChangeText, placeholder?, label?, inputType?, disabled?, multiline?, numberOfLines?
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
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
};

export function MoniInput({ value, onChangeText, placeholder, label, inputType = 'text', disabled = false, multiline = false, numberOfLines }: Props) {
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
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.outlineVariant}
        secureTextEntry={isPassword}
        keyboardType={isEmail ? 'email-address' : isNumeric ? 'numeric' : 'default'}
        autoCapitalize={isPassword || isEmail ? 'none' : 'sentences'}
        autoCorrect={!isPassword && !isEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          styles.input,
          focused && styles.inputFocused,
          disabled && styles.inputDisabled,
          multiline && styles.inputMultiline,
        ]}
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
  inputDisabled: {
    backgroundColor: colors.surfaceContainerLow,
    color: colors.slateGray,
  },
  inputMultiline: {
    height: undefined,
    minHeight: spacing.inputHeight * 2,
    paddingVertical: spacing.stackSm,
    textAlignVertical: 'top',
  },
});
