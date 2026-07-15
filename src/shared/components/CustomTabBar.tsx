/**
 * CustomTabBar — Component
 *
 * @what     Tab bar minimalista: 4 íconos con label + FAB central esmeralda sobresaliente 28px.
 *           Active state: línea 3px bajo label. Glow esmeralda en FAB.
 * @receives BottomTabBarProps (state, navigation, insets)
 * @processes tabPress via navigation.dispatch. FAB protrude = 28px sobre la barra. No renderiza
 *           nada si la tab activa es "quick-add" — es un flujo de pantalla completa (Registro de
 *           Gasto), no una pestaña navegable en la que uno se queda.
 * @returns  JSX — barra blanca 50px + FAB 60px con ring interior y glow, o null en quick-add.
 * @props    BottomTabBarProps
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { colors, radius, spacing, sizes, typography } from '@shared/styles';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];
type TabCfg   = { name: string; icon: IconName; label: string };

const LEFT_TABS: TabCfg[]  = [
  { name: 'index',   icon: 'home',       label: 'Inicio'   },
  { name: 'planner', icon: 'event-note', label: 'Agenda'   },
];
const RIGHT_TABS: TabCfg[] = [
  { name: 'jars',   icon: 'account-balance-wallet', label: 'Jarras'   },
  { name: 'review', icon: 'bar-chart',              label: 'Revisión' },
];

const FAB_SIZE    = sizes.iconFab;   // 52
const FAB_PROTRUDE = 20;

export function CustomTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index]?.name ?? '';

  if (activeRoute === 'quick-add') return null;

  const handlePress = useCallback((routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.dispatch(CommonActions.navigate(routeName));
  }, [state.routes, navigation]);

  function renderTab({ name, icon, label }: TabCfg) {
    const isActive = activeRoute === name;
    const tint = isActive ? colors.emeraldSuccess : colors.slateGray;
    return (
      <Pressable key={name} style={styles.tab} onPress={() => handlePress(name)}>
        <View style={[styles.indicator, isActive && styles.indicatorActive]} />
        <MaterialIcons name={icon} size={22} color={tint} />
        <Text style={[styles.tabLabel, { color: tint }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.outer, { paddingBottom: insets.bottom }]}>

      {/* FAB sobresaliente */}
      <View style={styles.fabWrap} pointerEvents="box-none">
        <Pressable style={styles.fab} onPress={() => handlePress('quick-add')}>
          <View style={styles.fabRing} />
          <MaterialIcons name="add" size={26} color={colors.pureWhite} />
        </Pressable>
      </View>

      {/* Barra */}
      <View style={styles.bar}>
        {LEFT_TABS.map(renderTab)}
        <View style={styles.centerGap}>
          <Text style={styles.centerLabel}>Añadir</Text>
        </View>
        {RIGHT_TABS.map(renderTab)}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.black,
    overflow: 'visible',
    shadowColor: colors.navyDark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },

  fabWrap: {
    position: 'absolute',
    top: -FAB_PROTRUDE,
    left: 0, right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: FAB_SIZE, height: FAB_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.emeraldSuccess,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.emeraldSuccess,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  fabRing: {
    position: 'absolute',
    width: FAB_SIZE - 10, height: FAB_SIZE - 10,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.pureWhite,
    opacity: 0.3,
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: spacing.stackSm,
    backgroundColor: colors.pureWhite,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackXxs,
    paddingTop: spacing.stackXs,
  },
  tabLabel:        { ...typography.labelXs, letterSpacing: 0.2 },
  indicator:       { position: 'absolute', top: 0, width: 36, height: 2, borderRadius: radius.sm, backgroundColor: colors.transparent },
  indicatorActive: { backgroundColor: colors.emeraldSuccess, opacity: 0.55 },

  centerGap:    { width: FAB_SIZE + FAB_PROTRUDE, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: spacing.stackXs },
  centerLabel:  { ...typography.labelXs, color: colors.slateGray },
});
