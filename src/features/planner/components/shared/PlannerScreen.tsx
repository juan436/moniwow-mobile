/**
 * PlannerScreen — Component
 *
 * @what     Orquestador Agenda: PlannerTabBar hide-on-scroll (content-first, sin AppTopBar) + página activa.
 * @receives —
 * @processes Content-first: sin barra global (logo/campanita/avatar vive solo en Dashboard). Las
 *           pestañas SON el header de la pantalla y se ocultan al bajar para dar más espacio al
 *           contenido. inputRange usa Math.max(1, tabBarHeight) para evitar [0,0] inválido en primer
 *           render. Lee ?tab=&filter= de la URL (ej. desde "Próximos compromisos" del dashboard) y
 *           fuerza esos valores — el tab de Agenda no se desmonta al cambiar de tab de la app, así
 *           que sin esto quedaba pegado en el último tab/filtro que el usuario haya dejado abierto.
 * @returns  JSX — statusBarBg + float animado (PlannerTabBar) + página activa.
 * @props    0
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@shared/styles';
import { usePlanner } from '../../hooks/usePlanner';
import { PlannerTabBar } from './PlannerTabBar';
import { MyMonthPage } from '../my-month/MyMonthPage';
import { ListsPage } from '../lists/ListsPage';
import { RecurringPage } from '../recurring/RecurringPage';
import type { AgendaTab, AgendaFilter } from '../../types';

export function PlannerScreen() {
  const insets   = useSafeAreaInsets();
  const { activeTab, setActiveTab, activeFilter, setActiveFilter, data, overdue, toConfirm, onConfirmItem, recurrentes, recurrenteActions } = usePlanner();
  const { tab: tabParam, filter: filterParam } = useLocalSearchParams<{ tab?: AgendaTab; filter?: AgendaFilter }>();
  const scrollY  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
    if (filterParam) setActiveFilter(filterParam);
  }, [tabParam, filterParam, setActiveTab, setActiveFilter]);

  const [tabBarHeight, setTabBarHeight] = useState(0);

  // Oculta PlannerTabBar al hacer scroll (content-first)
  const floatTranslateY = scrollY.interpolate({
    inputRange:  [0, Math.max(1, tabBarHeight)],
    outputRange: [0, -tabBarHeight],
    extrapolate: 'clamp',
  });

  function handleTabChange(tab: AgendaTab) {
    setActiveTab(tab);
    scrollY.setValue(0);
  }

  const topOffset  = tabBarHeight;
  const pageProps  = { scrollY, topOffset };
  const layout     = useMemo(() => ({ scrollY, topOffset }), [scrollY, topOffset]);
  // data + atrasados + a-confirmar + acción viajan juntas: MyMonthPage ya llega al tope de 5 props
  const agenda     = useMemo(
    () => ({ data, overdue, toConfirm, onConfirm: onConfirmItem }),
    [data, overdue, toConfirm, onConfirmItem],
  );

  return (
    <View style={styles.screen}>
      {activeTab === 'mi-mes' && (
        <MyMonthPage agenda={agenda} activeFilter={activeFilter} onFilterChange={setActiveFilter} {...pageProps} />
      )}
      {activeTab === 'listas' && (
        <ListsPage {...pageProps} />
      )}
      {activeTab === 'recurrentes' && (
        <RecurringPage recurrentes={recurrentes} activeFilter={activeFilter} onFilterChange={setActiveFilter} layout={layout} actions={recurrenteActions} />
      )}

      <View style={[styles.statusBarBg, { height: insets.top }]} />

      <Animated.View style={[styles.float, { transform: [{ translateY: floatTranslateY }] }]}>
        <View style={{ paddingTop: insets.top }} onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}>
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
});
