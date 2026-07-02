/**
 * AhorroDetailModal — Component
 *
 * @what     Modal de la jarra Ahorro: saldo total + acceso a Sueños/Metas o a transferir de una
 *           meta puntual. Ahorro no es un pozo único, es la suma de metas — por eso "Transferir"
 *           primero manda a elegir de cuál.
 * @receives 2 props: item, onClose
 * @processes "Ir a Sueños y Metas" → /suenos. "Transferir" → /suenos?mode=withdraw (GoalsScreen
 *           muestra el selector de meta y lanza el Slider de Sacrificio). Navegación pura, sin
 *           importar features/goals/ — ver [[planes/psicologia-ux]].
 * @returns  JSX — Modal fade centrado, mismo layout monto-primero que JarDetailModal.
 * @props    2: item, onClose
 */
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { MoniButton } from '@shared/components';
import type { JarDisplay } from '../types';

function handlePopupPress() {}
function handleGoToGoals() { router.push('/suenos'); }
function handleGoToTransfer() { router.push('/suenos?mode=withdraw'); }

type Props = {
  item: JarDisplay | null;
  onClose: () => void;
};

export function AhorroDetailModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <View style={styles.amountZone}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
            <Text style={styles.jarName}>Ahorro</Text>
          </View>

          <View style={styles.divider} />

          <MoniButton label="Ir a Sueños y Metas" onPress={handleGoToGoals} variant="secondary" />
          <MoniButton label="Transferir" onPress={handleGoToTransfer} />

        </Pressable>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:    { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  amountZone: { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  amount:   { ...typography.headlineLg, color: colors.navyDark, textAlign: 'center' },
  jarName:  { ...typography.labelMd, color: colors.slateGray, textAlign: 'center' },
  divider:  { height: 1, backgroundColor: colors.surfaceContainerLow },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
