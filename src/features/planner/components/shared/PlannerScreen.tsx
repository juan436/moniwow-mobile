/**
 * PlannerScreen — Component
 *
 * @what     Orquestador Agenda: AppTopBar hide-on-scroll + PlannerTabBar siempre visible + página activa.
 * @receives —
 * @processes AppTopBar y PlannerTabBar en el mismo float. Se translada -appBarHeight:
 *           AppTopBar desaparece arriba; PlannerTabBar sube a su lugar y permanece visible siempre.
 *           inputRange usa Math.max(1, appBarHeight) para evitar [0,0] inválido en primer render.
 * @returns  JSX — statusBarBg + float animado (AppTopBar + divider + PlannerTabBar) + página activa.
 * @props    0
 */
import { useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTopBar } from '@shared/components';
import { colors } from '@shared/styles';
import { usePlanner } from '../../hooks/usePlanner';
import { PlannerTabBar } from './PlannerTabBar';
import { MyMonthPage } from '../my-month/MyMonthPage';
import { ListsPage } from '../lists/ListsPage';
import { RecurringPage } from '../recurring/RecurringPage';
import type { AgendaTab } from '../../types';

export function PlannerScreen() {
  const insets   = useSafeAreaInsets();
  const { activeTab, setActiveTab, activeFilter, setActiveFilter, data, recurrentes, recurrenteActions } = usePlanner();
  const scrollY  = useRef(new Animated.Value(0)).current;

  const [appBarHeight, setAppBarHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);

  const totalHeight = appBarHeight + tabBarHeight;

  // Oculta AppTopBar + PlannerTabBar juntos al hacer scroll
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
        <MyMonthPage data={data} activeFilter={activeFilter} onFilterChange={setActiveFilter} {...pageProps} />
      )}
      {activeTab === 'listas' && (
        <ListsPage listas={data.listas} {...pageProps} />
      )}
      {activeTab === 'recurrentes' && (
        <RecurringPage recurrentes={recurrentes} activeFilter={activeFilter} onFilterChange={setActiveFilter} layout={layout} actions={recurrenteActions} />
      )}

      <View style={[styles.statusBarBg, { height: insets.top }]} />

      <Animated.View style={[styles.float, { transform: [{ translateY: floatTranslateY }] }]}>
        <View onLayout={(e) => setAppBarHeight(e.nativeEvent.layout.height)}>
          <AppTopBar />
        </View>
        <View style={styles.divider} />
        <View onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}>
          <PlannerTabBar activeTab={activeTab} onTabChange={handleTabChange} />
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
