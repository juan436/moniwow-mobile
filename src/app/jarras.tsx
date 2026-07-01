/**
 * JarrasScreen — Screen
 *
 * @what     Lista completa de jarras con saldo total, grid 2 columnas y creación de jarras.
 * @receives —
 * @processes Carga jars desde useDashboard, combina con jarras creadas localmente (custom, sin
 *           backend aún). Calcula saldo total acumulado sobre el combinado.
 * @returns  JSX — FlatList 2 columnas con header scrolleable + CreateJarModal.
 * @props    —
 */
import { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { JarItem } from '@features/dashboard/components/JarItem';
import { CreateJarModal } from '@features/dashboard/components/CreateJarModal';
import { useDashboard } from '@features/dashboard/hooks/useDashboard';
import type { JarDisplay, CreateJarData } from '@features/dashboard/types';

function handleBack() { router.back(); }
function RowSeparator() { return <View style={styles.rowSep} />; }

export default function JarrasScreen() {
  const { jars: baseJars } = useDashboard();
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
    <>
      <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
        <Pressable style={styles.backBtn} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Mis jarras</Text>
        <Pressable style={styles.addBtn} onPress={handleOpenCreate} hitSlop={8}>
          <MaterialIcons name="add" size={24} color={colors.emeraldSuccess} />
        </Pressable>
      </View>

      <View style={[styles.summaryCard, shadows.card]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryIconWrap}>
            <MaterialIcons name="account-balance-wallet" size={20} color={colors.emeraldSuccess} />
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{jars.length} activas</Text>
          </View>
        </View>
        <Text style={styles.summaryLabel}>Saldo total en jarras</Text>
        <Text style={styles.summaryAmount}>$ {total.toLocaleString('es')}</Text>
      </View>

      <Text style={styles.sectionTitle}>Todas las jarras</Text>
    </>
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
  screen:  { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg * 3 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.stackMd,
    paddingRight: spacing.marginPage,
    paddingBottom: spacing.stackSm,
    gap: spacing.stackSm,
    backgroundColor: colors.pureWhite,
    marginHorizontal: -spacing.marginPage,
    ...shadows.card,
  },
  backBtn: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.headlineMd, color: colors.navyDark, flex: 1 },
  addBtn: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.full,
    backgroundColor: colors.emeraldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    gap: spacing.stackSm,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackMd,
    borderLeftWidth: 3,
    borderLeftColor: colors.emeraldSuccess,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryIconWrap: {
    width: sizes.iconSm,
    height: sizes.iconSm,
    borderRadius: radius.lg,
    backgroundColor: colors.emeraldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPill: {
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.stackXxs,
    backgroundColor: colors.emeraldTint,
    borderRadius: radius.full,
  },
  countText:     { ...typography.labelSm, color: colors.emeraldSuccess },
  summaryLabel:  { ...typography.labelMd, color: colors.slateGray },
  summaryAmount: { ...typography.headlineLg, color: colors.navyDark },
  sectionTitle:  { ...typography.bodyMdBold, color: colors.navyDark, marginBottom: spacing.stackSm },
  row:            { gap: spacing.stackMd },
  rowSep:         { height: spacing.stackMd },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
});
