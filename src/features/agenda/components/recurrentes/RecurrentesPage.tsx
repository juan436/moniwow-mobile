/**
 * RecurrentesPage — Component
 *
 * @what     Tab Recurrentes: filtros scrollables + header sección + lista de compromisos + modal añadir.
 * @receives 5 props: recurrentes, activeFilter, onFilterChange, scrollY, topOffset
 * @processes Filtra recurrentes por activeFilter. Gestiona showModal local. AgendaFilterChips dentro del scroll.
 * @returns  JSX — Fragment: ScrollView vertical con chips + sectionHeader + lista + ProgramarCompromisoModal.
 * @props    5: recurrentes, activeFilter, onFilterChange, scrollY, topOffset
 */
import { useState, useCallback } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { AgendaFilterChips } from '../shared/AgendaFilterChips';
import { RecurrenteItem } from './RecurrenteItem';
import { ProgramarCompromisoModal } from './ProgramarCompromisoModal';
import type { RecurrenteDisplay, AgendaFilter } from '../../types';

type Props = {
  recurrentes: RecurrenteDisplay[];
  activeFilter: AgendaFilter;
  onFilterChange: (filter: AgendaFilter) => void;
  scrollY: Animated.Value;
  topOffset: number;
};

export function RecurrentesPage({ recurrentes, activeFilter, onFilterChange, scrollY, topOffset }: Props) {
  const items = recurrentes.filter((r) => r.filter === activeFilter);
  const [showModal, setShowModal]       = useState(false);
  const [editingItem, setEditingItem]   = useState<RecurrenteDisplay | null>(null);

  const handleEdit       = useCallback((id: string) => {
    const found = recurrentes.find((r) => r.id === id);
    if (found) setEditingItem(found);
  }, [recurrentes]);
  const handleProgramar  = useCallback(() => setShowModal(true), []);
  const handleModalClose = useCallback(() => { setShowModal(false); setEditingItem(null); }, []);

  return (
    <>
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <AgendaFilterChips activeFilter={activeFilter} onFilterChange={onFilterChange} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Compromisos activos</Text>
          <MoniButton label="Añadir" onPress={handleProgramar} size="sm" />
        </View>

        <View style={styles.divider} />

        <View style={styles.list}>
          {items.map((item) => (
            <RecurrenteItem key={item.id} item={item} onEdit={handleEdit} />
          ))}
        </View>
      </Animated.ScrollView>

      <ProgramarCompromisoModal
        visible={showModal || !!editingItem}
        initialType={activeFilter}
        onClose={handleModalClose}
        editItem={editingItem ?? undefined}
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
