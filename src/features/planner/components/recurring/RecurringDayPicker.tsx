/**
 * RecurringDayPicker — Component
 *
 * @what     Selector de día(s) en grid. Sin `mes` (modo Recurrente): grid fijo 1-31, mismo patrón
 *           se repite cada mes. Con `mes` (modo Personalizada): acotado a los días reales de ese
 *           mes (28-31 según corresponda) — no todos los meses tienen 31 días. `single` (Ingreso/
 *           Gasto): un solo día seleccionable, tap reemplaza en vez de sumar al array.
 * @receives 4 props: mes, selected, onChange, single
 * @processes Multi (default): toggle agrega o quita del array, mantiene orden ascendente. Single:
 *           tap siempre reemplaza la selección completa por ese día. Filas de 7 columnas con
 *           celdas flex:1 (mismo patrón que MonthCalendar) para que los círculos ocupen el ancho
 *           completo, sin espacio vacío en los bordes; última fila incompleta rellena con celdas
 *           invisibles para mantener columnas alineadas.
 * @returns  JSX — grid de filas 7 columnas, círculos edge-to-edge.
 * @props    4: mes, selected, onChange, single
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '@shared/styles';

type Props = {
  mes?: number;
  selected: number[];
  onChange: (days: number[]) => void;
  single?: boolean;
};

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const COLS = 7;

function chunk(days: number[]): number[][] {
  const rows: number[][] = [];
  for (let i = 0; i < days.length; i += COLS) rows.push(days.slice(i, i + COLS));
  return rows;
}

export function RecurringDayPicker({ mes, selected, onChange, single }: Props) {
  const totalDays = mes ? DAYS_IN_MONTH[mes - 1] : 31;
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const rows = chunk(days);

  function toggle(day: number) {
    if (single) { onChange([day]); return; }
    const next = selected.includes(day) ? selected.filter((d) => d !== day) : [...selected, day].sort((a, b) => a - b);
    onChange(next);
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((day) => {
            const isSelected = selected.includes(day);
            return (
              <Pressable key={day} style={[styles.chip, isSelected && styles.chipActive]} onPress={() => toggle(day)}>
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{day}</Text>
              </Pressable>
            );
          })}
          {row.length < COLS && Array.from({ length: COLS - row.length }, (_, i) => <View key={`empty-${i}`} style={[styles.chip, styles.chipEmpty]} />)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.stackSm },
  row:  { flexDirection: 'row', gap: spacing.stackSm },
  chip: { flex: 1, aspectRatio: 1, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  chipEmpty:      { borderWidth: 0 },
  chipActive:     { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  chipText:       { ...typography.bodyMd, color: colors.slateGray },
  chipTextActive: { color: colors.pureWhite },
});
