/**
 * DashboardScreen — Component (Screen)
 *
 * @what     Pantalla Inicio: header hide-on-scroll + DashboardPage standalone.
 * @receives Ninguna prop — screen raíz del tab Inicio.
 * @processes scrollY para hide-on-scroll del header. `data` memoizado — objeto inline como
 *           prop JSX causa re-render en cada render del padre (code_rules §2). Combina
 *           useDashboard() + useJars() (jars/ es dueño real de los datos de jarras).
 * @returns  JSX — statusBarBg fijo + DashboardPage + headerFloat animado.
 * @props    —
 */
import { useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@shared/styles';
import { useDashboard } from '../../hooks/useDashboard';
import { useJars } from '@features/jars/hooks/useJars';
import { DashboardHeader } from './DashboardHeader';
import { DashboardPage } from '../DashboardPage';

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const data    = useDashboard();
  const { jars } = useJars();

  const headerTranslateY = scrollY.interpolate({
    inputRange:  [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const pageData = useMemo(
    () => ({ saldoLibre: data.saldoLibre, jars, transactions: data.transactions, upcoming: data.upcoming }),
    [data.saldoLibre, jars, data.transactions, data.upcoming]
  );

  return (
    <View style={styles.screen}>
      <DashboardPage data={pageData} scrollY={scrollY} topOffset={headerHeight} />

      <View style={[styles.statusBarBg, { height: insets.top }]} />
      <Animated.View
        style={[styles.headerFloat, { transform: [{ translateY: headerTranslateY }] }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <DashboardHeader />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },
  statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: colors.pureWhite },
  headerFloat: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: colors.pureWhite },
});
