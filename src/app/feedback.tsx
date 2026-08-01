/**
 * FeedbackRoute — Route (thin wrapper)
 *
 * @what     Ruta /feedback — buzón de desarrollo. Delega en FeedbackScreen.
 * @returns  JSX — FeedbackScreen.
 */
import { FeedbackScreen } from '@features/feedback/components/FeedbackScreen';

export default function FeedbackRoute() {
  return <FeedbackScreen />;
}
