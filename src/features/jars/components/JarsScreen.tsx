/**
 * JarsScreen — Component (Screen)
 *
 * @what     Lista completa de jarras con saldo total, grid 2 columnas y creación de jarras.
 * @receives —
 * @processes Carga jars desde useJars, combina con jarras creadas localmente (custom, sin
 *           backend aún). Calcula saldo total acumulado sobre el combinado. Si el total es impar,
 *           agrega un ítem invisible (FILLER_ID) para que la última card no estire flex:1 sobre
 *           las 2 columnas — sin esto, una fila con un solo item ocupa todo el ancho. Tocar la
 *           jarra Ahorro navega a Sueños (/suenos) — nunca resta directo. Cualquier otra jarra
 *           abre JarDetailModal.
 * @returns  JSX — FlatList 2 columnas con JarsListHeader + CreateJarModal + JarDetailModal.
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
import { JarDetailModal } from './JarDetailModal';
import { useJars } from '../hooks/useJars';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import type { JarDisplay, CreateJarData } from '../types';

const FILLER_ID = '__filler__';

function handleBack() { router.back(); }
function RowSeparator() { return <View style={styles.rowSep} />; }

export function JarsScreen() {
  const { jars: baseJars } = useJars();
  const { transactions }   = useTransactions();
  const insets   = useSafeAreaInsets();
  const [customJars, setCustomJars]     = useState<JarDisplay[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [selectedJar, setSelectedJar]   = useState<JarDisplay | null>(null);

  const jars  = useMemo(() => [...baseJars, ...customJars], [baseJars, customJars]);
  const total = useMemo(() => jars.reduce((s, j) => s + j.balance, 0), [jars]);

  const gridJars = useMemo(() => {
    if (jars.length % 2 === 0) return jars;
    return [...jars, { id: FILLER_ID } as JarDisplay];
  }, [jars]);

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

  const handleJarPress = useCallback((jar: JarDisplay) => {
    if (jar.id === 'ahorro') router.push('/suenos');
    else setSelectedJar(jar);
  }, []);
  const handleCloseDetail = useCallback(() => setSelectedJar(null), []);

  const renderItem = useCallback(
    ({ item }: { item: JarDisplay }) =>
      item.id === FILLER_ID
        ? <View style={styles.filler} />
        : <JarItem jar={item} onPress={() => handleJarPress(item)} />,
    [handleJarPress]
  );

  const ListHeader = useMemo(() => (
    <JarsListHeader total={total} count={jars.length} topInset={insets.top} onBack={handleBack} onCreate={handleOpenCreate} />
  ), [total, jars.length, insets.top, handleOpenCreate]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={gridJars}
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
      <JarDetailModal item={selectedJar} transactions={transactions} onClose={handleCloseDetail} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: colors.background },
  content:        { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg * 3 },
  row:            { gap: spacing.stackMd },
  rowSep:         { height: spacing.stackMd },
  filler:         { flex: 1 },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
});
