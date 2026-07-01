/**
 * MiMesCalendar — Component
 *
 * @what     Vista calendario del mes actual para Mi Mes. Grid 7 columnas + ítems del día seleccionado.
 * @receives 3 props: items, activeFilter, onAction
 * @processes Construye grid del mes actual. Dots por día con ítems. Tap día → lista ítems.
 * @returns  JSX — View con header mes + labels + grid + ítems seleccionados.
 * @props    3: items, activeFilter, onAction
 */
import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { AgendaItem } from '../shared/AgendaItem';
import { MiMesDayCell } from './MiMesDayCell';
import type { AgendaFilter, AgendaItemDisplay } from '../../types';

type Props = {
  items: AgendaItemDisplay[];
  activeFilter: AgendaFilter;
  onAction: (id: string) => void;
};

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_LABELS  = ['L','M','X','J','V','S','D'];
const DOT_COLOR: Record<AgendaFilter, string> = {
  gastos:   colors.alertOrange,
  ingresos: colors.emeraldSuccess,
  deudas:   colors.goldDreams,
};

function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const total    = new Date(year, month + 1, 0).getDate();
  const offset   = firstDay === 0 ? 6 : firstDay - 1;
  const grid: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= total; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export function MiMesCalendar({ items, activeFilter, onAction }: Props) {
  const now   = useMemo(() => new Date(), []);
  const year  = now.getFullYear();
  const month = now.getMonth();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysWithItems = useMemo(() => new Set(items.map((i) => i.day)), [items]);
  const selectedItems = useMemo(
    () => selectedDay ? items.filter((i) => i.day === selectedDay) : [],
    [items, selectedDay],
  );

  const handleDayPress = useCallback((day: number) => {
    setSelectedDay((prev) => prev === day ? null : day);
  }, []);

  const weeks = useMemo(() => {
    const grid = buildGrid(year, month);
    const result: (number | null)[][] = [];
    for (let i = 0; i < grid.length; i += 7) result.push(grid.slice(i, i + 7));
    return result;
  }, [year, month]);

  const dotColor = DOT_COLOR[activeFilter];

  return (
    <View style={styles.container}>
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>

        <View style={styles.dayLabelsRow}>
          {DAY_LABELS.map((d) => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((day, di) => day !== null ? (
              <MiMesDayCell
                key={di}
                day={day}
                isSelected={selectedDay === day}
                hasItems={daysWithItems.has(day)}
                dotColor={dotColor}
                onPress={handleDayPress}
              />
            ) : (
              <View key={di} style={styles.emptyCell} />
            ))}
          </View>
        ))}
      </View>

      {selectedItems.length > 0 && (
        <View style={styles.itemsList}>
          {selectedItems.map((item) => (
            <AgendaItem key={item.id} item={item} onAction={onAction} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { gap: spacing.stackMd, paddingHorizontal: spacing.marginPage },
  card:         { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.cardPadding, gap: spacing.stackSm },
  monthLabel:   { ...typography.bodyMdBold, color: colors.navyDark, textAlign: 'center', marginBottom: spacing.stackXs },
  dayLabelsRow: { flexDirection: 'row' },
  dayLabel:     { flex: 1, ...typography.labelXs, color: colors.slateGray, textAlign: 'center', paddingVertical: spacing.stackXs },
  week:         { flexDirection: 'row' },
  emptyCell:    { flex: 1 },
  itemsList:    { gap: spacing.stackMd },
});
