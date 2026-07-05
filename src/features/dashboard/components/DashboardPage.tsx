/**
 * DashboardPage — Component
 *
 * @what     Página principal del dashboard: saldo libre + mensaje motivacional + progreso de
 *           metas + jarras + vencimientos + movimientos.
 * @receives 3 props: data, scrollY, topOffset
 * @processes Renderiza secciones verticales. JarCard/JarDisplay/JarDetailModal/GoalsJarModal
 *           vienen de features/jars/, TransactionDisplay de features/transactions/,
 *           goalProgress/goalsTotal/metaGlobal de features/audit/ — excepciones documentadas a
 *           "features no se conocen entre sí" (dashboard = composition root del home,
 *           unidireccional, ver clean_architecture.md). Tap en jarra Goals abre GoalsJarModal;
 *           cualquier otra (incluida Fondo Seguridad) abre JarDetailModal con su historial
 *           filtrado.
 * @returns  JSX — ScrollView vertical con todas las secciones.
 * @props    3: data, scrollY, topOffset
 */
import { useState, useCallback } from 'react';
import { View, Text, Animated, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { HeroBalance } from './HeroBalance';
import { MotivationMessage } from './MotivationMessage';
import { GoalsProgressBanner } from './GoalsProgressBanner';
import { JarCard } from '@features/jars/components/JarCard';
import { JarDetailModal } from '@features/jars/components/JarDetailModal';
import { GoalsJarModal } from '@features/jars/components/GoalsJarModal';
import { TransactionItem } from './TransactionItem';
import { TransactionDetailModal } from './TransactionDetailModal';
import { UpcomingItem } from './UpcomingItem';
import { UpcomingDetailModal } from './UpcomingDetailModal';
import type { JarDisplay } from '@features/jars/types';
import type { TransactionDisplay } from '@features/transactions/types';
import type { UpcomingExpense } from '../types';

type Data = {
  saldoLibre: number;
  jars: JarDisplay[];
  transactions: TransactionDisplay[];
  upcoming: UpcomingExpense[];
  goalProgress: number;
  goalsTotal: number;
  metaGlobal: number;
};
type Props = { data: Data; scrollY: Animated.Value; topOffset: number };

function handleAddPress() { router.push('/add-income'); }
function handleVerJarras() { router.push('/jarras'); }
function handleFiltroMovimientos() { router.push('/movimientos'); }
function handleVerAgenda() { router.push('/agenda?tab=mi-mes&filter=gastos'); }

export function DashboardPage({ data, scrollY, topOffset }: Props) {
  const { saldoLibre, jars, transactions, upcoming, goalProgress, goalsTotal, metaGlobal } = data;
  const [selectedTx, setSelectedTx] = useState<TransactionDisplay | null>(null);
  const handleTxLongPress  = useCallback((tx: TransactionDisplay) => setSelectedTx(tx), []);
  const handleTxModalClose = useCallback(() => setSelectedTx(null), []);

  const [selectedUpcoming, setSelectedUpcoming] = useState<UpcomingExpense | null>(null);
  const handleUpcomingLongPress  = useCallback((item: UpcomingExpense) => setSelectedUpcoming(item), []);
  const handleUpcomingModalClose = useCallback(() => setSelectedUpcoming(null), []);

  const [selectedJar, setSelectedJar] = useState<JarDisplay | null>(null);
  const handleJarPress = useCallback((jar: JarDisplay) => setSelectedJar(jar), []);
  const handleJarModalClose = useCallback(() => setSelectedJar(null), []);
  const isGoalsSelected = selectedJar?.id === 'goals';

  return (
    <Animated.ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: topOffset }]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
    >
      <View style={styles.heroSection}>
        <HeroBalance balance={saldoLibre} onAddPress={handleAddPress} />
      </View>

      <View style={styles.bannerSection}>
        <MotivationMessage />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis jarras</Text>
          <Pressable hitSlop={8} onPress={handleVerJarras}><Text style={styles.sectionLink}>Ver todas</Text></Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jarsRow}>
          {jars.map((jar) => <JarCard key={jar.id} jar={jar} onPress={() => handleJarPress(jar)} />)}
        </ScrollView>
      </View>

      <View style={styles.bannerSection}>
        <GoalsProgressBanner goalProgress={goalProgress} goalsTotal={goalsTotal} metaGlobal={metaGlobal} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos movimientos</Text>
          <Pressable hitSlop={8} onPress={handleFiltroMovimientos}><MaterialIcons name="tune" size={20} color={colors.primary} /></Pressable>
        </View>
        <View style={styles.movimientosCard}>
          {transactions.slice(0, 5).map((tx) => <TransactionItem key={tx.id} transaction={tx} onLongPress={handleTxLongPress} />)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos compromisos</Text>
          <Pressable hitSlop={8} onPress={handleVerAgenda}><MaterialIcons name="chevron-right" size={26} color={colors.primary} /></Pressable>
        </View>
        <View style={styles.upcomingCard}>
          {upcoming.map((item, i) => (
            <UpcomingItem key={item.id} item={item} isLast={i === upcoming.length - 1} onLongPress={handleUpcomingLongPress} />
          ))}
        </View>
      </View>
      <TransactionDetailModal item={selectedTx} onClose={handleTxModalClose} />
      <UpcomingDetailModal item={selectedUpcoming} onClose={handleUpcomingModalClose} />
      <GoalsJarModal item={isGoalsSelected ? selectedJar : null} onClose={handleJarModalClose} />
      <JarDetailModal item={!isGoalsSelected ? selectedJar : null} transactions={transactions} onClose={handleJarModalClose} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:      { flex: 1 },
  content:     { paddingBottom: spacing.stackLg },
  heroSection: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd },
  section:     { marginTop: spacing.stackMd },
  bannerSection: { marginTop: spacing.stackMd, paddingHorizontal: spacing.marginPage },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.marginPage, marginBottom: spacing.stackSm },
  sectionTitle: { ...typography.bodyMdBold, color: colors.navyDark },
  sectionLink:  { ...typography.labelMd, color: colors.primary },
  jarsRow:      { paddingHorizontal: spacing.marginPage, gap: spacing.gutter },
  upcomingCard: { marginHorizontal: spacing.marginPage, backgroundColor: colors.pureWhite, borderRadius: radius.card, paddingHorizontal: spacing.gutter, ...shadows.card },
  movimientosCard: { marginHorizontal: spacing.marginPage, backgroundColor: colors.pureWhite, borderRadius: radius.card, overflow: 'hidden', ...shadows.card },
});
