/**
 * DebtCard — Component
 *
 * @what     Card deuda total: donut SVG por categoría + lista de ítems con long-press modal.
 * @receives 3 props: deudaTotal, deudaPagada, deudaBreakdown
 * @processes Calcula ángulos donut y segmentos. Delega filas a DebtRow y modal a DebtDetailModal.
 * @returns  JSX — card blanca con donut centrado + lista + modal detalle.
 * @props    3: deudaTotal, deudaPagada, deudaBreakdown
 */
import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import type { DebtBreakdown } from '../../types';
import { DebtRow } from './DebtRow';
import { DebtDetailModal } from './DebtDetailModal';

type Props = {
  deudaTotal: number;
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

export function DebtCard({ deudaTotal, deudaPagada, deudaBreakdown }: Props) {
  const [selected, setSelected] = useState<DebtBreakdown | null>(null);

  const totalAmount = useMemo(() => deudaBreakdown.reduce((s, d) => s + d.amount, 0), [deudaBreakdown]);
  const restante    = useMemo(() => Math.round(deudaTotal * (1 - deudaPagada / 100)), [deudaTotal, deudaPagada]);

  const segments = useMemo(() => {
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
          <Text style={styles.cardLabel}>Deuda total</Text>
          <Text style={styles.deudaAmount}>-$ {deudaTotal.toLocaleString('es')}.00</Text>
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
          <Text style={styles.centerAmount}>$ {restante.toLocaleString('es')}</Text>
          <Text style={styles.centerLabel}>restante</Text>
        </View>
      </View>

      <View style={styles.list}>
        {segments.map(({ item, color }) => (
          <DebtRow key={item.id} item={item} color={color} onLongPress={handleDebtLongPress} />
        ))}
      </View>

      <DebtDetailModal item={selected} color={selectedColor} onClose={handleModalClose} />
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
