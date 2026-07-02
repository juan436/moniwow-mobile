/**
 * SuenosRoute — Screen (app route)
 *
 * @what Wrapper expo-router de "Sueños". Ya no es tab — se llega tocando la jarra Ahorro
 *       en el tab Jarras. Renderiza GoalsScreen.
 */
import { GoalsScreen } from '@features/goals/components/GoalsScreen';

export default function SuenosRoute() {
  return <GoalsScreen />;
}
