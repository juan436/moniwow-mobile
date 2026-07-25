/**
 * AgendaTab — Screen
 *
 * @what     Wrapper expo-router para la feature Planner (M03/M05/M11).
 * @processes Compone `reload` de `useJars()` y lo pasa como `onJarsChanged` — FB-013: pagar una cuota
 *           o confirmar una recurrencia escribe en el libro, y el balance de la jarra lo suma el
 *           servidor; sin refrescar acá quedaba viejo hasta recargar la app.
 * @returns  JSX — PlannerScreen.
 */
import { useJars } from '@features/jars/hooks/useJars';
import { PlannerScreen } from '@features/planner/components/shared/PlannerScreen';

export default function PlannerTab() {
  const { reload } = useJars();
  return <PlannerScreen onJarsChanged={reload} />;
}
