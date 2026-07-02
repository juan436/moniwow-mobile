/**
 * PlannerFilterChips — Component
 *
 * @what     Chips de filtro: 💸 Ingresos | 🛍️ Gastos | 🏦 Deudas.
 * @receives 2 props: activeFilter, onFilterChange
 * @processes Handlers memoizados por key. Renderiza 3 chips con estado activo (fondo esmeralda).
 * @returns  JSX — Row horizontal de chips.
 * @props    2: activeFilter, onFilterChange
 */
import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { colors, typography, spacing, radius } from '@shared/styles';
import type { AgendaFilter } from '../../types';

const FILTERS: { key: AgendaFilter; label: string; emoji: string }[] = [
  { key: 'gastos',   label: 'Gastos',   emoji: '🛍️' },
  { key: 'ingresos', label: 'Ingresos', emoji: '💸' },
  { key: 'deudas',   label: 'Deudas',   emoji: '🏦' },
];

type Props = {
  activeFilter: AgendaFilter;
  onFilterChange: (filter: AgendaFilter) => void;
};

export function PlannerFilterChips({ activeFilter, onFilterChange }: Props) {
  const handlers = useMemo<Record<AgendaFilter, () => void>>(
    () => ({
      gastos:   () => onFilterChange('gastos'),
      ingresos: () => onFilterChange('ingresos'),
      deudas:   () => onFilterChange('deudas'),
    }),
    [onFilterChange],
  );

  return (
    <View style={styles.container}>
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.key;
        return (
          <Pressable
            key={f.key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={handlers[f.key]}
            hitSlop={4}
          >
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{f.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.stackSm,
    paddingHorizontal: spacing.marginPage,
    paddingVertical: spacing.stackSm,
    backgroundColor: colors.background,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackXs,
    paddingVertical: spacing.stackSm,
    paddingHorizontal: spacing.stackSm,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.pureWhite,
  },
  chipActive: {
    backgroundColor: colors.emeraldSuccess,
    borderColor: colors.emeraldSuccess,
  },
  emoji: { fontSize: typography.labelMd.fontSize },
  label: { ...typography.labelMd, color: colors.slateGray },
  labelActive: { color: colors.pureWhite },
});
