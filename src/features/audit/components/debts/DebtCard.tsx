/**
 * DebtCard — Component
 *
 * @what     Card de deuda: donut SVG por deuda viva + lista de ítems con long-press modal.
 * @receives 4 props: deudaTotal, deudaOriginal, deudaPagada, deudaBreakdown
 * @processes `deudaTotal` es **lo que aún debes** (baja al pagar una cuota); `deudaOriginal` es lo que
 *           pediste, y solo sirve de referencia. Antes el restante se reconstruía a ojo desde el
 *           porcentaje ya redondeado (`total × (1 − pct/100)`) — un número derivado de otro número
 *           derivado, con el error acumulado dentro. Ahora llega calculado.
 *           El donut reparte lo VIVO: una deuda saldada no ocupa arco.
 * @returns  JSX — card blanca con donut centrado + lista + modal detalle.
 * @props    4: deudaTotal, deudaOriginal, deudaPagada, deudaBreakdown
 */
import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import type { DebtBreakdown } from '../../types';
import { DebtRow } from './DebtRow';
import { DebtDetailSheet } from './DebtDetailSheet';

type Props = {
  deudaTotal: number;
  deudaOriginal: number;
  deudaPagada: number;
  deudaBreakdown: DebtBreakdown[];
};

const DEBT_COLORS = [colors.alertOrange, colors.tertiary, colors.secondary, colors.goldDreams, colors.slateGray];
const SIZE = 160;
const CX   = SIZE / 2;
const CY   = SIZE / 2;
const R_OUT = 68;
const R_IN  = 46;
const GAP   = 3;

function polar(r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arc(start: number, end: number): string {
  const s  = polar(R_OUT, start);
  const e  = polar(R_OUT, end);
  const si = polar(R_IN,  end);
  const ei = polar(R_IN,  start);
  const lg = end - start > 180 ? 1 : 0;
  return `M${s.x},${s.y} A${R_OUT},${R_OUT},0,${lg},1,${e.x},${e.y} L${si.x},${si.y} A${R_IN},${R_IN},0,${lg},0,${ei.x},${ei.y} Z`;
}

export function DebtCard({ deudaTotal, deudaOriginal, deudaPagada, deudaBreakdown }: Props) {
  const [selected, setSelected] = useState<DebtBreakdown | null>(null);

  const totalAmount = useMemo(() => deudaBreakdown.reduce((s, d) => s + d.amount, 0), [deudaBreakdown]);

  const segments = useMemo(() => {
    if (totalAmount === 0) return []; // todo saldado: no hay arco que repartir
    let deg = 0;
    return deudaBreakdown.map((item, i) => {
      const sweep = (item.amount / totalAmount) * 360;
      const start = deg + GAP / 2;
      const end   = deg + sweep - GAP / 2;
      deg += sweep;
      return { path: arc(start, end), color: DEBT_COLORS[i % DEBT_COLORS.length], item };
    });
  }, [deudaBreakdown, totalAmount]);

  const selectedColor = useMemo(
    () => segments.find(s => s.item.id === selected?.id)?.color ?? colors.slateGray,
    [segments, selected]
  );

  const handleDebtLongPress = useCallback((item: DebtBreakdown) => setSelected(item), []);
  const handleModalClose    = useCallback(() => setSelected(null), []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cardLabel}>Lo que debes</Text>
          <Text style={styles.deudaAmount}>-$ {deudaTotal.toLocaleString('es')}</Text>
        </View>
        <View style={styles.pctBox}>
          <Text style={styles.pctValue}>{deudaPagada}%</Text>
          <Text style={styles.pctLabel}>pagado</Text>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <Svg width={SIZE} height={SIZE}>
          {segments.map((seg) => <Path key={seg.item.id} d={seg.path} fill={seg.color} />)}
        </Svg>
        <View style={styles.chartCenter}>
          <Text style={styles.centerAmount}>$ {deudaOriginal.toLocaleString('es')}</Text>
          <Text style={styles.centerLabel}>pediste</Text>
        </View>
      </View>

      <View style={styles.list}>
        {segments.map(({ item, color }) => (
          <DebtRow key={item.id} item={item} color={color} onLongPress={handleDebtLongPress} />
        ))}
      </View>

      <DebtDetailSheet item={selected} color={selectedColor} onClose={handleModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.card },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel:  { ...typography.bodyMdBold, color: colors.navyDark },
  deudaAmount: { ...typography.headlineMd, color: colors.alertOrange, marginTop: spacing.stackXs },
  pctBox:     { alignItems: 'flex-end', gap: spacing.stackXs },
  pctValue:   { ...typography.headlineMd, color: colors.navyDark },
  pctLabel:   { ...typography.labelSm, color: colors.slateGray },
  chartWrap:  { alignItems: 'center', justifyContent: 'center' },
  chartCenter: { position: 'absolute', alignItems: 'center' },
  centerAmount: { ...typography.bodyLg, color: colors.navyDark },
  centerLabel:  { ...typography.labelSm, color: colors.slateGray },
  list:       { gap: spacing.stackLg },
});
