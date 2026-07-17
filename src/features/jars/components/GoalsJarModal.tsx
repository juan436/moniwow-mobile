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
 * @returns  JSX — sheet, mismo layout monto-primero que JarDetailModal.
 * @props    2: item, onClose
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors, typography, spacing } from '@shared/styles';
import { MoniButton, MoniSheet } from '@shared/components';
import type { JarDisplay } from '../types';

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
    <MoniSheet visible={item !== null} onClose={onClose}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

          <View style={styles.amountZone}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              $ {item?.balance.toLocaleString('es')}
            </Text>
            <Text style={styles.jarName}>Metas</Text>
          </View>

          <View style={styles.divider} />

          <MoniButton label="Ir a Mis Metas y Objetivos" onPress={handleGoToGoals} variant="secondary" />
          <MoniButton label="Transferir" onPress={handleGoToTransfer} />

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:     { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackMd },
  amountZone: { alignItems: 'center', gap: spacing.stackSm, paddingVertical: spacing.stackSm },
  amount:   { ...typography.headlineLg, color: colors.navyDark, textAlign: 'center' },
  jarName:  { ...typography.labelMd, color: colors.slateGray, textAlign: 'center' },
  divider:  { height: 1, backgroundColor: colors.surfaceContainerLow },
});
