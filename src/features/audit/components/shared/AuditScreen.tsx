/**
 * AuditScreen — Component (Screen)
 *
 * @what     Pantalla Revisión: carrusel 4 páginas (Auditoría, MoniAI, Deudas, Resumen Metas).
 *           Content-first — sin AppTopBar: cada página trae su propio hero + los dots (PageIndicator)
 *           orientan; un título/barra global aquí sería redundante (el contenido cambia al deslizar).
 *           La barra global (logo/campanita/avatar) vive solo en Dashboard.
 * @receives Ninguna prop — screen raíz del tab Revisión.
 * @processes scrollY compartido entre páginas (lo consume el onScroll de cada página). `pageProps`/
 *           `indicator`/`data` por página van memoizados — objetos inline como prop JSX causan
 *           re-render en cada render del padre (code_rules §2). Lee `?page=goals` de la URL (ej.
 *           desde el banner de progreso de metas del dashboard) y salta directo a la página Mis
 *           Sueños (índice 3) — el tab no se desmonta al cambiar de tab de la app, por eso el salto
 *           se hace vía ref imperativo (`pagerRef.setPage`), no solo `initialPage`.
 * @returns  JSX — statusBarBg fijo + PagerView (content-first, sin header).
 * @props    —
 */
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import { colors, spacing } from '@shared/styles';
import { useAudit } from '../../hooks/useAudit';
import { OverviewPage } from '../overview/OverviewPage';
import { MoniAIPage } from '../moni-ai/MoniAIPage';
import { DebtsPage } from '../debts/DebtsPage';
import { GoalsSummaryPage } from '../goals-summary/GoalsSummaryPage';

const PAGE_COUNT   = 4;
const INITIAL_PAGE = 1;
const GOALS_PAGE   = 3;

export function AuditScreen() {
  const insets = useSafeAreaInsets();
  const { page: pageParam } = useLocalSearchParams<{ page?: string }>();
  const startPage = pageParam === 'goals' ? GOALS_PAGE : INITIAL_PAGE;
  const [activePage, setActivePage] = useState(startPage);
  const scrollY  = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<PagerView>(null);
  const data     = useAudit();

  useEffect(() => {
    if (pageParam === 'goals') {
      pagerRef.current?.setPage(GOALS_PAGE);
      setActivePage(GOALS_PAGE);
    }
  }, [pageParam]);

  const handlePageSelected = useCallback((position: number) => {
    setActivePage(position);
    scrollY.setValue(0);
  }, [scrollY]);

  const topOffset = insets.top + spacing.stackSm;
  const pageProps = useMemo(() => ({ scrollY, topOffset }), [scrollY, topOffset]);
  const indicator = useMemo(() => ({ count: PAGE_COUNT, active: activePage }), [activePage]);

  const auditoriaData = useMemo(
    () => ({ barChart: data.barChart, fugas: data.fugas, distribution: data.distribution }),
    [data.barChart, data.fugas, data.distribution]
  );
  const mundoParaleloData = useMemo(
    () => ({ patrimonio: data.patrimonio, deudaTotal: data.deudaTotal, deudaPagada: data.deudaPagada, deudaBreakdown: data.deudaBreakdown }),
    [data.patrimonio, data.deudaTotal, data.deudaPagada, data.deudaBreakdown]
  );
  const misSuenosData = useMemo(
    () => ({ goalProgress: data.goalProgress, goalsTotal: data.goalsTotal, metaGlobal: data.metaGlobal, goals: data.goals }),
    [data.goalProgress, data.goalsTotal, data.metaGlobal, data.goals]
  );

  return (
    <View style={styles.screen}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={startPage}
        onPageSelected={(e) => handlePageSelected(e.nativeEvent.position)}
      >
        <View key="0" style={styles.page}>
          <OverviewPage data={auditoriaData} indicator={indicator} {...pageProps} />
        </View>
        <View key="1" style={styles.page}>
          <MoniAIPage indicator={indicator} {...pageProps} />
        </View>
        <View key="2" style={styles.page}>
          <DebtsPage data={mundoParaleloData} indicator={indicator} {...pageProps} />
        </View>
        <View key="3" style={styles.page}>
          <GoalsSummaryPage data={misSuenosData} indicator={indicator} {...pageProps} />
        </View>
      </PagerView>

      <View style={[styles.statusBarBg, { height: insets.top }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  pager:       { flex: 1 },
  page:        { flex: 1 },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.background },
});
