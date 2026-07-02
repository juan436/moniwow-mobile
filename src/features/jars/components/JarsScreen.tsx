/**
 * JarsScreen — Component (Screen)
 *
 * @what     Lista completa de jarras con saldo total, grid 2 columnas, crear/editar/eliminar/
 *           transferir.
 * @receives —
 * @processes Carga jars + CRUD desde useJars (dueño real del estado). Si el total es impar,
 *           agrega un ítem invisible (FILLER_ID) para que la última card no estire flex:1 sobre
 *           las 2 columnas. Tocar la jarra Ahorro abre AhorroDetailModal (Ir a Sueños / Transferir),
 *           nunca resta directo. Cualquier otra abre JarDetailModal, que a su vez puede abrir
 *           TransferSheet o EditJarModal sobre la misma jarra activa (`activeJar` + `mode`).
 * @returns  JSX — FlatList 2 columnas + JarsListHeader + CreateJarModal + JarDetailModal +
 *           AhorroDetailModal + TransferSheet + EditJarModal.
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
import { AhorroDetailModal } from './AhorroDetailModal';
import { TransferSheet } from './TransferSheet';
import { EditJarModal } from './EditJarModal';
import { useJars } from '../hooks/useJars';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import type { JarDisplay } from '../types';

const FILLER_ID = '__filler__';
type Mode = 'detail' | 'edit' | 'transfer' | 'ahorro' | null;

function handleBack() { router.back(); }
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
    setMode(jar.id === 'ahorro' ? 'ahorro' : 'detail');
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
      <AhorroDetailModal item={mode === 'ahorro' ? activeJar : null} onClose={handleCloseModals} />
      <JarDetailModal
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
      <EditJarModal
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
  screen:         { flex: 1, backgroundColor: colors.background },
  content:        { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg * 3 },
  row:            { gap: spacing.stackMd },
  rowSep:         { height: spacing.stackMd },
  filler:         { flex: 1 },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
});
