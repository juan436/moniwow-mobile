/**
 * RecurringPage — Component
 *
 * @what     Tab Recurrentes: filtros scrollables + header sección + lista de compromisos + modales añadir/editar.
 * @receives 5 props: recurrentes, activeFilter, onFilterChange, layout, actions
 * @processes Filtra recurrentes por activeFilter. Gestiona showAddModal + editingItem locales. PlannerFilterChips dentro del scroll.
 * @returns  JSX — Fragment: ScrollView vertical con chips + sectionHeader + lista + CreateRecurringModal + EditRecurringModal.
 * @props    5: recurrentes, activeFilter, onFilterChange, layout, actions
 */
import { useState, useCallback } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { PlannerFilterChips } from '../shared/PlannerFilterChips';
import { RecurringItem } from './RecurringItem';
import { CreateRecurringModal } from './CreateRecurringModal';
import { EditRecurringModal } from './EditRecurringModal';
import type { RecurringDisplay, AgendaFilter, RecurringActions } from '../../types';

type Props = {
  recurrentes: RecurringDisplay[];
  activeFilter: AgendaFilter;
  onFilterChange: (filter: AgendaFilter) => void;
  layout: { scrollY: Animated.Value; topOffset: number };
  actions: RecurringActions;
};

export function RecurringPage({ recurrentes, activeFilter, onFilterChange, layout, actions }: Props) {
  const { scrollY, topOffset } = layout;
  const items = recurrentes.filter((r) => r.filter === activeFilter);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem]   = useState<RecurringDisplay | null>(null);

  const handleEdit      = useCallback((id: string) => {
    const found = recurrentes.find((r) => r.id === id);
    if (found) setEditingItem(found);
  }, [recurrentes]);
  const handleProgramar = useCallback(() => setShowAddModal(true), []);
  const handleCloseAdd  = useCallback(() => setShowAddModal(false), []);
  const handleCloseEdit = useCallback(() => setEditingItem(null), []);

  return (
    <>
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <PlannerFilterChips activeFilter={activeFilter} onFilterChange={onFilterChange} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Compromisos activos</Text>
          <MoniButton label="Añadir" onPress={handleProgramar} size="sm" />
        </View>

        <View style={styles.divider} />

        <View style={styles.list}>
          {items.map((item) => (
            <RecurringItem key={item.id} item={item} onEdit={handleEdit} />
          ))}
        </View>
      </Animated.ScrollView>

      <CreateRecurringModal
        visible={showAddModal}
        initialType={activeFilter}
        onClose={handleCloseAdd}
        onCreate={actions.onCreate}
      />
      <EditRecurringModal
        visible={editingItem !== null}
        item={editingItem}
        onClose={handleCloseEdit}
        onSave={actions.onSave}
        onDelete={actions.onDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.stackLg, gap: spacing.stackMd },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.marginPage,
  },
  sectionTitle: { ...typography.bodyMdBold, color: colors.navyDark },
  divider: { height: 1, backgroundColor: colors.outlineVariant + '55', marginHorizontal: spacing.marginPage },
  list: { paddingHorizontal: spacing.marginPage, gap: spacing.stackMd },
});
