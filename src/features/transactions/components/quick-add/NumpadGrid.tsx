/**
 * NumpadGrid — Component
 *
 * @what     Teclado numérico 3×4 para Quick Add: dígitos 1-9, punto decimal, 0 y borrar.
 * @receives 1 prop: onKey
 * @processes Renderiza grid de 12 teclas. ⌫ usa ícono MaterialIcons.
 * @returns  JSX — grid 3 columnas × 4 filas de Pressable.
 * @props    1: onKey
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, radius, typography, sizes } from '@shared/styles';

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
] as const;

type Props = { onKey: (key: string) => void };

export function NumpadGrid({ onKey }: Props) {
  return (
    <View style={styles.grid}>
      {ROWS.map((row) => (
        <View key={row[0]} style={styles.row}>
          {row.map((key) => (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.key, pressed && styles.keyActive]}
              onPress={() => onKey(key)}
              hitSlop={4}
            >
              {key === '⌫'
                ? <MaterialIcons name="backspace" size={24} color={colors.navyDark} />
                : <Text style={styles.keyText}>{key}</Text>
              }
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid:      { gap: spacing.stackSm, paddingHorizontal: spacing.marginPage },
  row:       { flexDirection: 'row', gap: spacing.stackSm },
  key:       {
    flex: 1, height: sizes.numpadKeyHeight,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  keyActive: { backgroundColor: colors.surfaceContainerLow },
  keyText:   { ...typography.headlineMd, color: colors.navyDark },
});
