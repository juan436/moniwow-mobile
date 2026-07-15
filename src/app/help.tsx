/**
 * HelpRoute — Route (thin wrapper)
 *
 * @what     Ruta /help — ayuda y soporte. Delega en HelpScreen (feature settings).
 * @returns  JSX — HelpScreen.
 */
import { HelpScreen } from '@features/settings/components/HelpScreen';

export default function HelpRoute() {
  return <HelpScreen />;
}
