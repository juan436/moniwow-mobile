/**
 * RevisionScreen — Component (Screen)
 *
 * @what     Pantalla Revisión: header hide-on-scroll + carrusel 4 páginas (Auditoría, MoniAI, Mundo Paralelo, Mis Sueños).
 * @receives Ninguna prop — screen raíz del tab Revisión.
 * @processes scrollY compartido entre páginas. Header se oculta al bajar y reaparece al subir.
 *           Al cambiar página, scrollY se resetea a 0 y header reaparece.
 * @returns  JSX — statusBarBg fijo + PagerView + headerFloat animado.
 * @props    —
 */
import { useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import { colors } from '@shared/styles';
import { AppTopBar } from '@shared/components';
import { useRevision } from '../../hooks/useRevision';
import { AuditoriaPage } from '../auditoria/AuditoriaPage';
import { MoniAIPage } from '../moni-ai/MoniAIPage';
import { MundoParaleloPage } from '../mundo-paralelo/MundoParaleloPage';
import { MisSuenosPage } from '../mis-suenos/MisSuenosPage';

const PAGE_COUNT   = 4;
const INITIAL_PAGE = 1;

export function RevisionScreen() {
  const insets = useSafeAreaInsets();
  const [activePage, setActivePage]     = useState(INITIAL_PAGE);
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const data    = useRevision();

  const headerTranslateY = scrollY.interpolate({
    inputRange:  [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  function handlePageSelected(position: number) {
    setActivePage(position);
    scrollY.setValue(0);
  }

  const pageProps = { scrollY, topOffset: headerHeight };
  const indicator = { count: PAGE_COUNT, active: activePage };

  return (
    <View style={styles.screen}>
      <PagerView
        style={styles.pager}
        initialPage={INITIAL_PAGE}
        onPageSelected={(e) => handlePageSelected(e.nativeEvent.position)}
      >
        <View key="0" style={styles.page}>
          <AuditoriaPage
            data={{ barChart: data.barChart, fugas: data.fugas, distribution: data.distribution }}
            indicator={indicator}
            {...pageProps}
          />
        </View>
        <View key="1" style={styles.page}>
          <MoniAIPage indicator={indicator} {...pageProps} />
        </View>
        <View key="2" style={styles.page}>
          <MundoParaleloPage
            data={{ patrimonio: data.patrimonio, deudaTotal: data.deudaTotal, deudaPagada: data.deudaPagada, deudaBreakdown: data.deudaBreakdown }}
            indicator={indicator}
            {...pageProps}
          />
        </View>
        <View key="3" style={styles.page}>
          <MisSuenosPage
            data={{ goalProgress: data.goalProgress, ahorroTotal: data.ahorroTotal, metaGlobal: data.metaGlobal, goals: data.goals }}
            indicator={indicator}
            {...pageProps}
          />
        </View>
      </PagerView>

      <View style={[styles.statusBarBg, { height: insets.top }]} />
      <Animated.View
        style={[styles.headerFloat, { transform: [{ translateY: headerTranslateY }] }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <AppTopBar />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  pager:       { flex: 1 },
  page:        { flex: 1 },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.pureWhite },
  headerFloat: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.pureWhite },
});
