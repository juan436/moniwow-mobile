/**
 * AllocationBar — Component
 *
 * @what     Barra segmentada: proporción del ingreso asignada a cada jarra del workspace.
 * @receives 3 props: jars, distribution, total
 * @processes Calcula % por jarra sobre el total, oculta segmentos en cero.
 * @returns  JSX — track redondeado con un segmento de color por jarra con monto asignado.
 * @props    3: jars, distribution, total
 */
import { View, StyleSheet } from 'react-native';

import { colors, radius, sizes } from '@shared/styles';
import type { JarOption, IncomeDistribution } from '../../types';

type Props = { jars: JarOption[]; distribution: IncomeDistribution; total: number };

export function AllocationBar({ jars, distribution, total }: Props) {
  return (
    <View style={styles.track}>
      {jars.map(({ id, iconColor }) => {
        const pct = total > 0 ? ((distribution[id] ?? 0) / total) * 100 : 0;
        if (pct <= 0) return null;
        return <View key={id} style={[styles.segment, { width: `${pct}%` as `${number}%`, backgroundColor: iconColor }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track:   { flexDirection: 'row', height: sizes.trackXs, borderRadius: radius.full, overflow: 'hidden', backgroundColor: colors.surfaceContainerHigh },
  segment: { height: '100%' },
});
