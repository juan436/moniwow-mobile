/**
 * DashboardHeader — Component
 *
 * @what     TopAppBar del Dashboard. Delegado a AppTopBar (shared).
 * @receives —
 * @returns  JSX — AppTopBar genérico.
 * @props    0
 */
import { AppTopBar } from '@shared/components';

export function DashboardHeader() {
  return <AppTopBar />;
}
