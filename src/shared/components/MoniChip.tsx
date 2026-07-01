/**
 * MoniChip — Component
 *
 * @what     Etiqueta pequeña seleccionable con estado activo/inactivo.
 * @receives 3 props: label, active? (boolean), onPress?
 * @processes Cambia color de fondo y texto según estado active.
 * @returns  JSX — Pressable con radius 16, colores del design system.
 * @props    3: label, active?, onPress?
 */
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../styles';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function MoniChip({ label, active = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.active : styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.chip,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.iceWhite,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...typography.labelMd,
  },
  labelActive: {
    color: colors.pureWhite,
  },
  labelInactive: {
    color: colors.slateGray,
  },
});
