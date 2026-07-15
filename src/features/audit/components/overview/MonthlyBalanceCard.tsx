/**
 * MonthlyBalanceCard — Component
 *
 * @what     Balance mensual: dos barras por mes (ingresos vs gastos) y las cifras del mes elegido.
 * @receives 3 props: barChart, selectedMonth, onSelectMonth
 * @processes **El neto no se dibuja: se lee en el hueco entre las dos barras.** Si la verde le saca
 *           ventaja a la gris, ese mes ahorraste. Cuando la de gastos SUPERA a la de ingresos se
 *           pinta naranja — esa es la única alerta real. Pintar todo gasto de rojo haría que un mes
 *           sano también pareciera una alarma, y el rojo dejaría de significar nada.
 *           Las cifras de 12 meses no caben en un teléfono: se muestran solo las del mes tocado, arriba.
 *           Ambas barras comparten escala (máximo de TODOS los meses, no del visible) — si cada una se
 *           escalara a su propio máximo, comparar alturas no significaría nada.
 *           **Scroll horizontal**: cada mes ocupa un ancho fijo, así caben ~6 en pantalla y el resto
 *           se arrastra con el dedo. Abre anclado a la DERECHA (el mes actual, que es el que importa)
 *           y se retrocede hacia el pasado. Meter 12 meses a la fuerza en el ancho de la card dejaba
 *           barras de 9px imposibles de tocar y etiquetas solapadas.
 * @returns  JSX — Card con cifras del mes + gráfica de barras pareadas con scroll.
 * @props    3: barChart, selectedMonth, onSelectMonth
 */
import { useMemo, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import type { BarChartEntry } from '../../types';

const MONTH_WIDTH = 50; // ~6 meses visibles en el ancho de la card

type Props = {
  barChart: BarChartEntry[];
  selectedMonth: string;
  onSelectMonth: (key: string) => void;
};

export function MonthlyBalanceCard({ barChart, selectedMonth, onSelectMonth }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const maxAmount = useMemo(
    () => Math.max(1, ...barChart.flatMap((b) => [b.ingresos, b.gastos])),
    [barChart],
  );

  const active = barChart.find((b) => b.key === selectedMonth) ?? barChart[barChart.length - 1];
  const neto = active ? active.ingresos - active.gastos : 0;

  // Al montar (y al crecer el libro) el gráfico se ancla al mes más reciente.
  function handleContentSizeChange() {
    scrollRef.current?.scrollToEnd({ animated: false });
  }

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.accentBar} />
      <Text style={styles.cardLabel}>Balance mensual</Text>

      {active && (
        <View style={styles.figures}>
          <Figure label="Ingresos" value={active.ingresos} tone={styles.income} />
          <Figure label="Gastos"   value={active.gastos}   tone={styles.expense} />
          <Figure label="Neto"     value={neto}            tone={neto < 0 ? styles.negative : styles.income} />
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={handleContentSizeChange}
        contentContainerStyle={styles.barChart}
      >
        {barChart.map((entry) => {
          const overspent = entry.gastos > entry.ingresos;
          const isActive = entry.key === selectedMonth;
          return (
            <Pressable
              key={entry.key}
              style={[styles.barGroup, isActive && styles.barGroupActive]}
              onPress={() => onSelectMonth(entry.key)}
            >
              <View style={styles.pair}>
                <View style={[styles.bar, styles.barIncome, { height: barHeight(entry.ingresos, maxAmount) }]} />
                <View style={[
                  styles.bar,
                  overspent ? styles.barOverspent : styles.barExpense,
                  { height: barHeight(entry.gastos, maxAmount) },
                ]} />
              </View>
              <Text style={[styles.barMonth, isActive && styles.barMonthActive]}>{entry.month}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function barHeight(value: number, max: number): number {
  return Math.max(2, (value / max) * sizes.barMaxHeight);
}

type FigureProps = { label: string; value: number; tone: { color: string } };

function Figure({ label, value, tone }: FigureProps) {
  const sign = value < 0 ? '-' : '';
  return (
    <View style={styles.figure}>
      <Text style={styles.figureLabel}>{label}</Text>
      <Text style={[styles.figureValue, tone]}>{sign}$ {Math.abs(value).toLocaleString('es')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm, overflow: 'hidden' },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.emeraldSuccess },
  cardLabel: { ...typography.bodyMdBold, color: colors.navyDark },

  figures:     { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.stackSm },
  figure:      { gap: 2 },
  figureLabel: { ...typography.labelXs, color: colors.slateGray },
  figureValue: { ...typography.labelMd },
  income:      { color: colors.emeraldSuccess },
  expense:     { color: colors.navyDark },
  negative:    { color: colors.alertOrange },

  barChart: {
    flexDirection: 'row', alignItems: 'flex-end',
    height: sizes.barMaxHeight + sizes.barLabelSpace,
  },
  barGroup: {
    width: MONTH_WIDTH, alignItems: 'center', gap: spacing.stackXs, justifyContent: 'flex-end',
    paddingVertical: spacing.stackXs, borderRadius: radius.sm,
  },
  barGroupActive: { backgroundColor: colors.surfaceContainerLow },
  pair:     { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: sizes.barMaxHeight },
  bar:      { width: 13, borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm },

  barIncome:    { backgroundColor: colors.emeraldSuccess },
  barExpense:   { backgroundColor: colors.slateGray },
  barOverspent: { backgroundColor: colors.alertOrange },

  barMonth:       { ...typography.labelXs, color: colors.slateGray },
  barMonthActive: { color: colors.navyDark, ...typography.labelSm },
});
