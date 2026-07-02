/**
 * MonthHeader — Component
 *
 * @what     Card resumen de totales para Mi Mes: label, monto grande, badge y toggle de vista.
 * @receives 4 props: totalAmount, activeFilter, viewMode, onToggleView
 * @processes Selecciona label y badge según activeFilter. Toggle lista/calendario top-right.
 * @returns  JSX — Card con monto destacado, badge y botón toggle.
 * @props    4: totalAmount, activeFilter, viewMode, onToggleView
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import type { AgendaFilter } from '../../types';

type ViewMode = 'list' | 'calendar';
type Config   = { label: string; badge: string };

const FILTER_CONFIG: Record<AgendaFilter, Config> = {
  gastos:   { label: 'Total Gastos Comprometidos',  badge: '80% de tus jarras bajo control' },
  ingresos: { label: 'Total Ingresos Esperados',    badge: 'Crecimiento este mes +5%' },
  deudas:   { label: 'Compromisos de Deuda',        badge: 'Al día con tus pagos' },
};

type Props = {
  totalAmount: number;
  activeFilter: AgendaFilter;
  viewMode: ViewMode;
  onToggleView: () => void;
};

export function MonthHeader({ totalAmount, activeFilter, viewMode, onToggleView }: Props) {
  const { label, badge } = FILTER_CONFIG[activeFilter];
  const toggleIcon = viewMode === 'list' ? 'calendar-month' : 'view-list';

  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <Pressable onPress={onToggleView} hitSlop={8}>
          <MaterialIcons name={toggleIcon} size={20} color={colors.primary} />
        </Pressable>
      </View>
      <Text style={styles.amount}>$ {totalAmount.toLocaleString('es')}.00</Text>
      <View style={styles.badge}>
        <MaterialIcons name="check-circle" size={16} color={colors.emeraldSuccess} />
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
