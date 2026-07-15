/**
 * TabsLayout — Layout
 *
 * @what     Navegación de 5 tabs con CustomTabBar (FAB flotante central + nav bar negra).
 * @returns  JSX — Tabs con screenOptions mínimo y tabBar custom.
 */
import { Tabs } from 'expo-router';

import { CustomTabBar } from '@shared/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index"     options={{ title: 'Inicio'   }} />
      <Tabs.Screen name="planner"   options={{ title: 'Agenda'   }} />
      <Tabs.Screen name="quick-add" options={{ title: ''         }} />
      <Tabs.Screen name="jars"      options={{ title: 'Jarras'   }} />
      <Tabs.Screen name="review"    options={{ title: 'Revisión' }} />
    </Tabs>
  );
}
