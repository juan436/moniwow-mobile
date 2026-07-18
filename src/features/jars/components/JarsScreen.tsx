/**
 * JarsScreen — Component (Screen)
 *
 * @what     Lista completa de jarras con saldo total, grid 2 columnas, crear/editar/eliminar/
 *           transferir.
 * @receives —
 * @processes Carga jars + CRUD desde useJars (dueño real del estado). Si el total es impar,
 *           agrega un ítem invisible (FILLER_ID) para que la última card no estire flex:1 sobre
 *           las 2 columnas. Tocar la jarra Goals abre GoalsJarSheet (Ir a Metas / Transferir),
 *           nunca resta directo. Cualquier otra (incluida Fondo Seguridad) abre JarDetailSheet, que
 *           a su vez puede abrir TransferSheet o EditJarSheet sobre la misma jarra activa
 *           (`activeJar` + `mode`).
 * @returns  JSX — content-first (sin AppTopBar; la barra global vive solo en Dashboard): FlatList 2
 *           columnas liderada por su propio summaryCard + JarsListHeader + CreateJarSheet +
 *           JarDetailSheet + GoalsJarSheet + TransferSheet + EditJarSheet.
 * @props    —
 */
import { useCallback, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@shared/styles';
import { JarItem } from './JarItem';
import { JarsListHeader } from './JarsListHeader';
import { CreateJarSheet } from './CreateJarSheet';
import { JarDetailSheet } from './JarDetailSheet';
import { GoalsJarSheet } from './GoalsJarSheet';
import { TransferSheet } from './TransferSheet';
import { EditJarSheet } from './EditJarSheet';
import { useJars } from '../hooks/useJars';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import type { JarDisplay } from '../types';

const FILLER_ID = '__filler__';
type Mode = 'detail' | 'edit' | 'transfer' | 'goals' | null;

function RowSeparator() { return <View style={styles.rowSep} />; }

export function JarsScreen() {
  const { jars, handleCreate, handleSave, handleDelete, handleTransfer } = useJars();
  const { transactions } = useTransactions();
  const insets = useSafeAreaInsets();
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [activeJar, setActiveJar] = useState<JarDisplay | null>(null);
  const [mode, setMode] = useState<Mode>(null);

  const total = useMemo(() => jars.reduce((s, j) => s + j.balance, 0), [jars]);

  const gridJars = useMemo(() => {
    if (jars.length % 2 === 0) return jars;
    return [...jars, { id: FILLER_ID } as JarDisplay];
  }, [jars]);

  const handleOpenCreate  = useCallback(() => setIsCreateVisible(true), []);
  const handleCloseCreate = useCallback(() => setIsCreateVisible(false), []);

  const handleJarPress = useCallback((jar: JarDisplay) => {
    setActiveJar(jar);
    setMode(jar.id === 'goals' ? 'goals' : 'detail');
  }, []);
  const handleCloseModals = useCallback(() => setMode(null), []);
  const handleOpenTransfer = useCallback(() => setMode('transfer'), []);
  const handleOpenEdit     = useCallback(() => setMode('edit'), []);
  const handleConfirmTransfer = useCallback((toId: string, amount: number) => {
    if (activeJar) handleTransfer(activeJar.id, toId, amount);
  }, [activeJar, handleTransfer]);

  const renderItem = useCallback(
    ({ item }: { item: JarDisplay }) =>
      item.id === FILLER_ID
        ? <View style={styles.filler} />
        : <JarItem jar={item} onPress={handleJarPress} />,
    [handleJarPress]
  );

  const ListHeader = useMemo(() => (
    <JarsListHeader total={total} count={jars.length} onCreate={handleOpenCreate} />
  ), [total, jars.length, handleOpenCreate]);

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
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.stackSm }]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
      />
      <View style={[styles.statusBarBg, { height: insets.top }]} />
      <CreateJarSheet visible={isCreateVisible} onClose={handleCloseCreate} onCreate={handleCreate} />
      <GoalsJarSheet item={mode === 'goals' ? activeJar : null} onClose={handleCloseModals} />
      <JarDetailSheet
        item={mode === 'detail' ? activeJar : null}
        transactions={transactions}
        onClose={handleCloseModals}
        onTransfer={handleOpenTransfer}
        onEdit={handleOpenEdit}
      />
      <TransferSheet
        visible={mode === 'transfer'}
        fromJar={activeJar}
        jars={jars}
        onClose={handleCloseModals}
        onTransfer={handleConfirmTransfer}
      />
      <EditJarSheet
        visible={mode === 'edit'}
        jar={activeJar}
        onClose={handleCloseModals}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  content:     { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg * 3 },
  row:         { gap: spacing.stackMd },
  rowSep:      { height: spacing.stackMd },
  filler:      { flex: 1 },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.background },
});
