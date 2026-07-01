/**
 * MoniButton — Component
 *
 * @what     Botón principal del design system con 3 variantes de color y 2 tamaños.
 * @receives 5 props: label, onPress, variant? ('primary'|'secondary'|'danger'), size? ('md'|'sm'), disabled?
 * @processes Aplica color según variante, padding y texto según size, radius=24, scale 0.98 al presionar.
 * @returns  JSX — Pressable estilizado con texto centrado.
 * @props    5: label, onPress, variant?, size?, disabled?
 */
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../styles';

type Variant = 'primary' | 'secondary' | 'danger';
type Size    = 'md' | 'sm';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
};

const bgColor: Record<Variant, string> = {
  primary:   colors.emeraldSuccess,
  secondary: colors.goldDreams,
  danger:    colors.alertOrange,
};

const buttonSize: Record<Size, { paddingVertical: number; paddingHorizontal: number }> = {
  md: { paddingVertical: spacing.stackMd, paddingHorizontal: spacing.stackLg },
  sm: { paddingVertical: spacing.stackSm, paddingHorizontal: spacing.stackMd },
};

export function MoniButton({ label, onPress, variant = 'primary', size = 'md', disabled = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        buttonSize[size],
        { backgroundColor: bgColor[variant] },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={size === 'md' ? styles.labelMd : styles.labelSm}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button:   { borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  pressed:  { transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  labelMd:  { ...typography.labelMd, color: colors.pureWhite },
  labelSm:  { ...typography.labelMd, color: colors.pureWhite },
});
