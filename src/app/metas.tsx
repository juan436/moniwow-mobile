/**
 * MetasRoute — Screen (app route)
 *
 * @what Wrapper expo-router de "Mis Metas y Objetivos". Ya no es tab — se llega tocando la
 *       jarra Goals. Renderiza GoalsScreen.
 */
import { GoalsScreen } from '@features/goals/components/GoalsScreen';

export default function MetasRoute() {
  return <GoalsScreen />;
}
