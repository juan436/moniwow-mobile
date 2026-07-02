/**
 * AgendaScreen — Component
 *
 * @what     Orquestador Agenda: AppTopBar hide-on-scroll + AgendaTabBar siempre visible + página activa.
 * @receives —
 * @processes AppTopBar y AgendaTabBar en el mismo float. Se translada -appBarHeight:
 *           AppTopBar desaparece arriba; AgendaTabBar sube a su lugar y permanece visible siempre.
 *           inputRange usa Math.max(1, appBarHeight) para evitar [0,0] inválido en primer render.
 * @returns  JSX — statusBarBg + float animado (AppTopBar + divider + AgendaTabBar) + página activa.
 * @props    0
 */
import { useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTopBar } from '@shared/components';
import { colors } from '@shared/styles';
import { useAgenda } from '../../hooks/useAgenda';
import { AgendaTabBar } from './AgendaTabBar';
import { MiMesPage } from '../mi-mes/MiMesPage';
import { ListasPage } from '../listas/ListasPage';
import { RecurrentesPage } from '../recurrentes/RecurrentesPage';
import type { AgendaTab } from '../../types';

export function AgendaScreen() {
  const insets   = useSafeAreaInsets();
  const { activeTab, setActiveTab, activeFilter, setActiveFilter, data, recurrentes, recurrenteActions } = useAgenda();
  const scrollY  = useRef(new Animated.Value(0)).current;

  const [appBarHeight, setAppBarHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);

  const totalHeight = appBarHeight + tabBarHeight;

  // Oculta AppTopBar + AgendaTabBar juntos al hacer scroll
  const floatTranslateY = scrollY.interpolate({
    inputRange:  [0, Math.max(1, totalHeight)],
    outputRange: [0, -totalHeight],
    extrapolate: 'clamp',
  });

  function handleTabChange(tab: AgendaTab) {
    setActiveTab(tab);
    scrollY.setValue(0);
  }

  const topOffset = appBarHeight + tabBarHeight;
  const pageProps  = { scrollY, topOffset };
  const layout     = useMemo(() => ({ scrollY, topOffset }), [scrollY, topOffset]);

  return (
    <View style={styles.screen}>
      {activeTab === 'mi-mes' && (
        <MiMesPage data={data} activeFilter={activeFilter} onFilterChange={setActiveFilter} {...pageProps} />
      )}
      {activeTab === 'listas' && (
        <ListasPage listas={data.listas} {...pageProps} />
      )}
      {activeTab === 'recurrentes' && (
        <RecurrentesPage recurrentes={recurrentes} activeFilter={activeFilter} onFilterChange={setActiveFilter} layout={layout} actions={recurrenteActions} />
      )}

      <View style={[styles.statusBarBg, { height: insets.top }]} />

      <Animated.View style={[styles.float, { transform: [{ translateY: floatTranslateY }] }]}>
        <View onLayout={(e) => setAppBarHeight(e.nativeEvent.layout.height)}>
          <AppTopBar />
        </View>
        <View style={styles.divider} />
        <View onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}>
          <AgendaTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.pureWhite },
  float:       { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.pureWhite },
  divider:     { height: 1, backgroundColor: colors.dividerSoft },
});
