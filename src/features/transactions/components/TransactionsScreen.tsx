/**
 * TransactionsScreen — Screen
 *
 * @what     Pantalla de movimientos con filtros por tipo y período. Params opcionales `jarId`/`jarName`
 *           (desde JarDetailSheet) → filtra a esa jarra y titula con su nombre.
 * @receives params: jarId?, jarName? (useLocalSearchParams).
 * @processes Filtra por jarra (si hay jarId), por MES/AÑO del navegador y por tipo. El mes no pasa del actual (`atCurrentMonth` deshabilita el arrow siguiente). FlatList §9.
 * @returns  JSX — header fijo + chips tipo (Todos/Ingresos/Gastos) + navegador mes (← mes →) + FlatList + footer.
 */
import { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { useTransactions } from '@features/transactions/hooks/useTransactions';
import { TransactionItem } from '@features/dashboard/components/TransactionItem';
import { TransactionDetailSheet } from '@features/dashboard/components/TransactionDetailSheet';
import type { TransactionDisplay } from '@features/transactions/types';

type FilterTipo = 'todos' | 'ingresos' | 'gastos';

const TIPO_CHIPS: { key: FilterTipo; label: string }[] = [
  { key: 'todos',    label: 'Todos' },
  { key: 'ingresos', label: 'Ingresos' },
  { key: 'gastos',   label: 'Gastos' },
];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'] as const;

function keyExtractor(item: TransactionDisplay) { return item.id; }

export function TransactionsScreen() {
  const { transactions } = useTransactions();
  const { jarId, jarName } = useLocalSearchParams<{ jarId?: string; jarName?: string }>();
  const insets = useSafeAreaInsets();
  const [filterTipo, setFilterTipo] = useState<FilterTipo>('todos');
  const [navMonth,   setNavMonth]   = useState(() => new Date().getMonth());
  const [navYear,    setNavYear]    = useState(() => new Date().getFullYear());
  const [selectedTx, setSelectedTx] = useState<TransactionDisplay | null>(null);
  const monthLabel = `${MESES[navMonth]} ${navYear}`;
  const now = new Date();
  const atCurrentMonth = navYear === now.getFullYear() && navMonth === now.getMonth();

  const filtered = useMemo<TransactionDisplay[]>(() => {
    const byJar = jarId ? transactions.filter((t) => t.jarId === jarId) : transactions;
    const byMonth = byJar.filter((t) => t.month === navMonth && t.year === navYear);
    const byTipo = filterTipo === 'todos'
      ? byMonth
      : byMonth.filter((t) => t.isIncome === (filterTipo === 'ingresos'));
    return byTipo.map((t) => ({ ...t, isLast: true }));
  }, [transactions, filterTipo, jarId, navMonth, navYear]);

  function handleBack()      { router.back(); }
  function handlePrevMonth() {
    if (navMonth === 0) { setNavMonth(11); setNavYear((y) => y - 1); }
    else setNavMonth((m) => m - 1);
  }
  function handleNextMonth() {
    if (navMonth === 11) { setNavMonth(0); setNavYear((y) => y + 1); }
    else setNavMonth((m) => m + 1);
  }
  const handleTipoSelect   = useCallback((key: FilterTipo) => setFilterTipo(key), []);
  const handleTxLongPress  = useCallback((tx: TransactionDisplay) => setSelectedTx(tx), []);
  const handleTxModalClose = useCallback(() => setSelectedTx(null), []);

  const renderItem = useCallback(
    ({ item }: { item: TransactionDisplay }) => (
      <View style={[styles.txCard, shadows.card]}>
        <TransactionItem transaction={item} onLongPress={handleTxLongPress} />
      </View>
    ),
    [handleTxLongPress]
  );

  return (
    <View style={styles.screen}>

      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: insets.top + spacing.stackSm }]}>
              <Pressable style={styles.backBtn} onPress={handleBack}>
                <MaterialIcons name="arrow-back" size={24} color={colors.navyDark} />
              </Pressable>
              <Text style={styles.headerTitle} numberOfLines={1}>{jarName ?? 'Movimientos'}</Text>
            </View>
            <View style={styles.filters}>
              <View style={styles.tipoRow}>
                {TIPO_CHIPS.map((chip) => (
                  <Pressable
                    key={chip.key}
                    style={[styles.chip, filterTipo === chip.key && styles.chipActive]}
                    onPress={() => handleTipoSelect(chip.key)}
                  >
                    <Text style={[styles.chipText, filterTipo === chip.key && styles.chipTextActive]}>
                      {chip.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.monthNav}>
                <Pressable style={styles.monthArrow} onPress={handlePrevMonth} hitSlop={8}>
                  <MaterialIcons name="chevron-left" size={24} color={colors.navyDark} />
                </Pressable>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <Pressable style={styles.monthArrow} onPress={handleNextMonth} hitSlop={8} disabled={atCurrentMonth}>
                  <MaterialIcons name="chevron-right" size={24} color={atCurrentMonth ? colors.slateGray : colors.navyDark} />
                </Pressable>
              </View>
            </View>
          </View>
        }
      />

      <View style={[styles.statusBarCover, { height: insets.top }]} />

      <View style={[styles.footer, { paddingBottom: insets.bottom }]} />
      <TransactionDetailSheet item={selectedTx} onClose={handleTxModalClose} />

    </View>
  );
}

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: colors.background },
  header:         { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.stackMd, paddingRight: spacing.marginPage, paddingVertical: spacing.stackSm, gap: spacing.stackSm, backgroundColor: colors.pureWhite, ...shadows.card, marginHorizontal: -spacing.marginPage },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.pureWhite },
  backBtn:        { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  headerTitle:    { ...typography.headlineMd, color: colors.navyDark, flex: 1 },
  filters:        { paddingTop: spacing.stackMd, paddingBottom: spacing.stackMd, gap: spacing.stackSm },
  tipoRow:        { flexDirection: 'row', justifyContent: 'center', gap: spacing.stackSm },
  monthNav:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.stackMd },
  monthArrow:     { padding: spacing.stackSm },
  monthLabel:     { ...typography.bodyMd, color: colors.navyDark, minWidth: 140, textAlign: 'center' },
  chip:           { paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm, borderRadius: radius.full, backgroundColor: colors.surfaceContainerLow },
  chipActive:     { backgroundColor: colors.primary },
  chipText:       { ...typography.labelMd, color: colors.slateGray },
  chipTextActive: { color: colors.pureWhite },
  list:           { flex: 1 },
  listContent:    { paddingHorizontal: spacing.marginPage, paddingBottom: spacing.stackLg, gap: spacing.stackSm },
  txCard:         { backgroundColor: colors.pureWhite, borderRadius: radius.card, overflow: 'hidden' },
  footer:         { backgroundColor: colors.pureWhite, ...shadows.footer },
});
