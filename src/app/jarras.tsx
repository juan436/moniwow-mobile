/**
 * JarrasScreen — Screen
 *
 * @what     Lista completa de jarras con saldo total y grid 2 columnas.
 * @receives —
 * @processes Carga jars desde useDashboard. Calcula saldo total acumulado.
 * @returns  JSX — FlatList 2 columnas con header scrolleable.
 * @props    —
 */
import { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { JarItem } from '@features/dashboard/components/JarItem';
import { useDashboard } from '@features/dashboard/hooks/useDashboard';
import type { JarDisplay } from '@features/dashboard/types';

function handleBack() { router.back(); }
function RowSeparator() { return <View style={styles.rowSep} />; }

export default function JarrasScreen() {
  const { jars } = useDashboard();
  const insets   = useSafeAreaInsets();

  const total = useMemo(() => jars.reduce((s, j) => s + j.balance, 0), [jars]);

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
  ), [total, jars.length, insets.top]);

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
