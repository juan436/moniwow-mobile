/**
 * PageIndicator — Component
 *
 * @what     Dots indicadores de página del carrusel horizontal.
 * @receives 3 props: count, active, light
 * @processes Renderiza N dots. Activo: ancho mayor. light=true invierte colores para fondos oscuros.
 * @returns  JSX — fila de dots centrada.
 * @props    3: count, active, light
 */
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@shared/styles';

type Props = {
  count: number;
  active: number;
  light?: boolean;
};

export function PageIndicator({ count, active, light = false }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            light ? styles.dotLight : styles.dotDark,
            i === active && (light ? styles.dotActiveLigh : styles.dotActiveDark),
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row:           { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.stackXs, paddingVertical: spacing.stackSm },
  dot:           { width: 6, height: 6, borderRadius: radius.full },
  dotDark:       { backgroundColor: colors.outlineVariant },
  dotLight:      { backgroundColor: colors.pureWhite + '40' },
  dotActiveDark: { width: 20, backgroundColor: colors.emeraldSuccess },
  dotActiveLigh: { width: 20, backgroundColor: colors.pureWhite },
});
