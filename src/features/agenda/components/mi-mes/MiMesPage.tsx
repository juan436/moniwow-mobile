/**
 * MiMesPage — Component
 *
 * @what     Tab Mi Mes: filtros + resumen + lista o calendario de compromisos del mes.
 * @receives 5 props: data, activeFilter, onFilterChange, scrollY, topOffset
 * @processes viewMode local toggle lista/calendario. Filtra ítems por activeFilter.
 * @returns  JSX — ScrollView con chips + header + lista o MiMesCalendar.
 * @props    5: data, activeFilter, onFilterChange, scrollY, topOffset
 */
import { useCallback, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { colors, spacing } from '@shared/styles';
import { AgendaHeader } from './AgendaHeader';
import { AgendaItem } from '../shared/AgendaItem';
import { AgendaFilterChips } from '../shared/AgendaFilterChips';
import { MiMesCalendar } from './MiMesCalendar';
import type { AgendaData, AgendaFilter } from '../../types';

type ViewMode = 'list' | 'calendar';

const TOTAL_BY_FILTER = (data: AgendaData, filter: AgendaFilter): number => {
  if (filter === 'gastos')   return data.totalGastos;
  if (filter === 'ingresos') return data.totalIngresos;
  return data.totalDeudas;
};

type Props = {
  data: AgendaData;
  activeFilter: AgendaFilter;
  onFilterChange: (filter: AgendaFilter) => void;
  scrollY: Animated.Value;
  topOffset: number;
};

export function MiMesPage({ data, activeFilter, onFilterChange, scrollY, topOffset }: Props) {
  const [allItems, setAllItems] = useState(data.items);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const items       = allItems.filter((i) => i.filter === activeFilter);
  const totalAmount = TOTAL_BY_FILTER(data, activeFilter);

  const handleAction = useCallback((id: string) => {
    setAllItems((prev) => prev.map((item) => item.id === id ? { ...item, isPaid: !item.isPaid } : item));
  }, []);

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => prev === 'list' ? 'calendar' : 'list');
  }, []);

  const content = viewMode === 'list'
    ? <View style={styles.list}>{items.map((item) => <AgendaItem key={item.id} item={item} onAction={handleAction} />)}</View>
    : <MiMesCalendar items={items} activeFilter={activeFilter} onAction={handleAction} />;

  return (
    <Animated.ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    >
      <AgendaFilterChips activeFilter={activeFilter} onFilterChange={onFilterChange} />
      <AgendaHeader
        totalAmount={totalAmount}
        activeFilter={activeFilter}
        viewMode={viewMode}
        onToggleView={handleToggleView}
      />
      {content}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1 },
  content:  { paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  list:     { paddingHorizontal: spacing.marginPage, gap: spacing.stackMd },
});
