/**
 * JarsScreen — Component (Screen)
 *
 * @what     Lista completa de jarras con saldo total, grid 2 columnas y creación de jarras.
 * @receives —
 * @processes Carga jars desde useJars, combina con jarras creadas localmente (custom, sin
 *           backend aún). Calcula saldo total acumulado sobre el combinado.
 * @returns  JSX — FlatList 2 columnas con JarsListHeader + CreateJarModal.
 * @props    —
 */
import { useCallback, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@shared/styles';
import { JarItem } from './JarItem';
import { JarsListHeader } from './JarsListHeader';
import { CreateJarModal } from './CreateJarModal';
import { useJars } from '../hooks/useJars';
import type { JarDisplay, CreateJarData } from '../types';

function handleBack() { router.back(); }
function RowSeparator() { return <View style={styles.rowSep} />; }

export function JarsScreen() {
  const { jars: baseJars } = useJars();
  const insets   = useSafeAreaInsets();
  const [customJars, setCustomJars]     = useState<JarDisplay[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  const jars  = useMemo(() => [...baseJars, ...customJars], [baseJars, customJars]);
  const total = useMemo(() => jars.reduce((s, j) => s + j.balance, 0), [jars]);

  const handleOpenCreate  = useCallback(() => setIsCreateVisible(true), []);
  const handleCloseCreate = useCallback(() => setIsCreateVisible(false), []);
  const handleCreate = useCallback((data: CreateJarData) => {
    setCustomJars((prev) => [...prev, {
      id: `custom-${Date.now()}`,
      name: data.name,
      emoji: data.emoji,
      balance: 0,
      iconBg: colors.emeraldTint,
      iconColor: colors.emeraldSuccess,
    }]);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: JarDisplay }) => <JarItem jar={item} />,
    []
  );

  const ListHeader = useMemo(() => (
    <JarsListHeader total={total} count={jars.length} topInset={insets.top} onBack={handleBack} onCreate={handleOpenCreate} />
  ), [total, jars.length, insets.top, handleOpenCreate]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={jars}
        keyExtractor={(j) => j.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={RowSeparator}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
      <View style={[styles.statusBarCover, { height: insets.top }]} />
      <CreateJarModal visible={isCreateVisible} onClose={handleCloseCreate} onCreate={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: colors.background },
  content:        { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg * 3 },
  row:            { gap: spacing.stackMd },
  rowSep:         { height: spacing.stackMd },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
});
