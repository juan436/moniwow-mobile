/**
 * MonthHeader — Component
 *
 * @what     Card resumen de Mi Mes: lo que queda por confirmar, progreso real y toggle de vista.
 * @receives 4 props: totals, activeFilter, viewMode, onToggleView
 * @processes **El monto es lo PENDIENTE, no el total del mes.** Antes sumaba todo el filtro —pagado o
 *           no—: confirmabas la renta y el número no se movía. Ahora pagar lo baja.
 *           **El badge dice el progreso real** (`3 de 12 pagados`). Antes era texto inventado que no
 *           salía de ningún dato: "80% de tus jarras bajo control", "Crecimiento este mes +5%".
 * @returns  JSX — Card con monto pendiente, badge de progreso y botón toggle.
 * @props    4: totals, activeFilter, viewMode, onToggleView
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import type { AgendaFilter, FilterTotals } from '../../types';

type ViewMode = 'list' | 'calendar';
type Config   = { label: string; done: string; empty: string };

const FILTER_CONFIG: Record<AgendaFilter, Config> = {
  gastos:   { label: 'Te falta pagar este mes',    done: 'pagados',    empty: 'Sin gastos programados' },
  ingresos: { label: 'Te falta cobrar este mes',   done: 'recibidos',  empty: 'Sin ingresos previstos' },
  deudas:   { label: 'Cuotas pendientes este mes', done: 'pagadas',    empty: 'Sin deudas activas' },
};

type Props = {
  totals: FilterTotals;
  activeFilter: AgendaFilter;
  viewMode: ViewMode;
  onToggleView: () => void;
};

export function MonthHeader({ totals, activeFilter, viewMode, onToggleView }: Props) {
  const { label, done, empty } = FILTER_CONFIG[activeFilter];
  const toggleIcon = viewMode === 'list' ? 'calendar-month' : 'view-list';

  const isAllDone = totals.count > 0 && totals.paidCount === totals.count;
  const badge     = totals.count === 0
    ? empty
    : `${totals.paidCount} de ${totals.count} ${done}`;

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <Pressable onPress={onToggleView} hitSlop={8}>
          <MaterialIcons name={toggleIcon} size={20} color={colors.primary} />
        </Pressable>
      </View>
      <Text style={styles.amount}>$ {totals.pending.toLocaleString('es')}</Text>
      <View style={styles.badge}>
        <MaterialIcons name={isAllDone ? 'check-circle' : 'schedule'} size={16} color={colors.emeraldSuccess} />
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.marginPage,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    gap: spacing.stackSm,
    alignItems: 'center',
  },
  topRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  label:     { ...typography.labelMd, color: colors.slateGray, flex: 1 },
  amount:    { ...typography.headlineMd, color: colors.navyDark },
  badge:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, backgroundColor: colors.emeraldSuccess + '1A', paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackXs, borderRadius: radius.full },
  badgeText: { ...typography.labelSm, color: colors.emeraldSuccess },
});
