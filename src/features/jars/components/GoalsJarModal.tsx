/**
 * GoalsJarModal — Component
 *
 * @what     Modal de la jarra Goals: saldo total + acceso a Mis Metas y Objetivos o a transferir de
 *           una meta puntual. Goals no es un pozo único, es la suma de metas — por eso "Transferir"
 *           primero manda a elegir de cuál.
 * @receives 2 props: item, onClose
 * @processes "Ir a Mis Metas y Objetivos" → /goals. "Transferir" → /goals-transfer
 *           (GoalsTransferScreen, pantalla propia con el selector de meta + Slider de Sacrificio).
 *           Ambos botones llaman onClose() antes de navegar — si no, el modal queda montado
 *           (visible=true) debajo de la pantalla nueva y da sensación de lentitud/doble transición.
 *           Navegación pura, sin importar features/goals/ — ver [[planes/psicologia-ux]].
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

type Props = {
  item: JarDisplay | null;
  onClose: () => void;
};

export function GoalsJarModal({ item, onClose }: Props) {
  const insets = useSafeAreaInsets();

  function handleGoToGoals() {
    onClose();
    router.push('/goals');
  }
  function handleGoToTransfer() {
    onClose();
    router.push('/goals-transfer');
  }

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <View style={styles.amountZone}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
            <Text style={styles.jarName}>Metas</Text>
          </View>

          <View style={styles.divider} />

          <MoniButton label="Ir a Mis Metas y Objetivos" onPress={handleGoToGoals} variant="secondary" />
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
