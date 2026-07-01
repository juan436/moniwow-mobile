/**
 * AgendaTabBar — Component
 *
 * @what     Carrusel horizontal de tabs: MI MES | LISTAS | RECURRENTES.
 * @receives 2 props: activeTab, onTabChange
 * @processes TabItem memoizado — solo re-renderiza el tab que cambia de estado.
 * @returns  JSX — ScrollView horizontal con borde inferior.
 * @props    2: activeTab, onTabChange
 */
import { memo, useCallback } from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native';

import { colors, typography, spacing } from '@shared/styles';
import type { AgendaTab } from '../../types';

const TABS: { key: AgendaTab; label: string }[] = [
  { key: 'mi-mes',      label: 'Mi mes' },
  { key: 'listas',      label: 'Listas' },
  { key: 'recurrentes', label: 'Recurrentes' },
];

type TabItemProps = {
  tabKey: AgendaTab;
  label: string;
  isActive: boolean;
  onTabChange: (tab: AgendaTab) => void;
};

const TabItem = memo(function TabItem({ tabKey, label, isActive, onTabChange }: TabItemProps) {
  const handlePress = useCallback(() => onTabChange(tabKey), [tabKey, onTabChange]);
  return (
    <Pressable
      style={[styles.tab, isActive && styles.tabActive]}
      onPress={handlePress}
      hitSlop={8}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
});

type Props = {
  activeTab: AgendaTab;
  onTabChange: (tab: AgendaTab) => void;
};

export function AgendaTabBar({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        bounces={false}
      >
        {TABS.map((tab) => (
          <TabItem
            key={tab.key}
            tabKey={tab.key}
            label={tab.label}
            isActive={activeTab === tab.key}
            onTabChange={onTabChange}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '4D',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.marginPage,
  },
  tab: {
    paddingVertical: spacing.stackSm,
    paddingHorizontal: spacing.stackMd,
    marginRight: spacing.stackSm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.emeraldSuccess },
  label: { ...typography.labelMd, color: colors.slateGray },
  labelActive: { ...typography.labelMd, color: colors.emeraldSuccess },
});
