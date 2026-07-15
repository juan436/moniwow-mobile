/**
 * MyMonthPage — Component
 *
 * @what     Tab Mi Mes: filtros + resumen + lista o calendario de compromisos del mes.
 * @receives 5 props: agenda, activeFilter, onFilterChange, scrollY, topOffset
 * @processes viewMode local toggle lista/calendario. Filtra ítems por activeFilter.
 *           **El "pagado" ya NO vive aquí.** Antes `handleAction` daba la vuelta a un booleano en un
 *           `useState` local: la fila se tachaba, no se escribía nada, y al volver a entrar reaparecía
 *           sin pagar. Ahora la acción sube al hook, que escribe el movimiento en el libro y confirma
 *           el compromiso en la BD.
 *           **El toque no escribe: pregunta.** Abre `ConfirmItemModal`. El movimiento es real e
 *           irreversible (baja una jarra, avanza una deuda) y todavía no hay deshacer.
 * @returns  JSX — ScrollView con chips + header + lista o MonthCalendar + modal de confirmación.
 * @props    5: agenda, activeFilter, onFilterChange, scrollY, topOffset
 */
import { useCallback, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { spacing } from '@shared/styles';
import { MonthHeader } from './MonthHeader';
import { PlannerItem } from '../shared/PlannerItem';
import { PlannerFilterChips } from '../shared/PlannerFilterChips';
import { MonthCalendar } from './MonthCalendar';
import { ConfirmItemModal } from './ConfirmItemModal';
import { OverdueBanner } from './OverdueBanner';
import { ConfirmIncomeBanner } from './ConfirmIncomeBanner';
import { useConfirmFlow } from '../../hooks/useConfirmFlow';
import type { AgendaData, AgendaFilter, AgendaItemDisplay } from '../../types';

type ViewMode = 'list' | 'calendar';

type Props = {
  agenda: {
    data: AgendaData;
    overdue: AgendaItemDisplay[];
    toConfirm: AgendaItemDisplay[];
    onConfirm: (id: string) => void;
  };
  activeFilter: AgendaFilter;
  onFilterChange: (filter: AgendaFilter) => void;
  scrollY: Animated.Value;
  topOffset: number;
};

export function MyMonthPage({ agenda, activeFilter, onFilterChange, scrollY, topOffset }: Props) {
  const { data, overdue, toConfirm, onConfirm } = agenda;
  // Un pago atrasado y una cuota atrasada son cosas distintas: cada pestaña cuenta la suya.
  const overduePagos   = overdue.filter((i) => !i.cuotaMonth);
  const overdueCuotas  = overdue.filter((i) => i.cuotaMonth);
  const toConfirmTotal = toConfirm.reduce((sum, item) => sum + item.amount, 0);
  const sumAmount      = (list: AgendaItemDisplay[]) => list.reduce((sum, i) => sum + i.amount, 0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { asking, ask, confirm, cancel } = useConfirmFlow(data.items, onConfirm);

  const items  = data.items.filter((i) => i.filter === activeFilter);
  const totals = data.totals[activeFilter];

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => prev === 'list' ? 'calendar' : 'list');
  }, []);

  const content = viewMode === 'list'
    ? <View style={styles.list}>{items.map((item) => <PlannerItem key={item.id} item={item} onAction={ask} />)}</View>
    : <MonthCalendar items={items} activeFilter={activeFilter} onAction={ask} />;

  return (
    <Animated.ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    >
      <PlannerFilterChips activeFilter={activeFilter} onFilterChange={onFilterChange} />
      {activeFilter === 'gastos' && <OverdueBanner kind="pagos"  count={overduePagos.length}  total={sumAmount(overduePagos)} />}
      {activeFilter === 'deudas' && <OverdueBanner kind="cuotas" count={overdueCuotas.length} total={sumAmount(overdueCuotas)} />}
      {activeFilter === 'ingresos' && <ConfirmIncomeBanner count={toConfirm.length} total={toConfirmTotal} />}
      <MonthHeader
        totals={totals}
        activeFilter={activeFilter}
        viewMode={viewMode}
        onToggleView={handleToggleView}
      />
      {content}
      <ConfirmItemModal item={asking} onConfirm={confirm} onCancel={cancel} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1 },
  content:  { paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  list:     { paddingHorizontal: spacing.marginPage, gap: spacing.stackMd },
});
