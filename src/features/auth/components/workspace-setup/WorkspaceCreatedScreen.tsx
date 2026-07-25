/**
 * WorkspaceCreatedScreen — Component
 *
 * @what     Confirmación tras crear un hogar: muestra el código de invitación (FB-017).
 * @receives 2 props: code, onContinue
 * @processes Única vez que se ve el código — el servidor lo devuelve en la respuesta de
 *           `POST /workspaces`, nunca se persiste en la app y no hay pantalla propia para volver a
 *           verlo (deuda conocida — depende de Ajustes reales, hoy mock). Texto seleccionable
 *           (mantener presionado para copiar) en vez de sumar `expo-clipboard` para un solo botón.
 * @returns  JSX — mismo layout hero+sheet que WorkspaceSetupScreen, con el código en el cuerpo.
 * @props    2: code, onContinue
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoniButton, MoniLogo } from '@shared/components';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';

type Props = { code: string; onContinue: () => void };

export function WorkspaceCreatedScreen({ code, onContinue }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <MoniLogo width={72} height={39} variant="light" />
        <Text style={styles.heroTitle}>Tu hogar{'\n'}está listo</Text>
        <Text style={styles.heroSubtitle}>Compartí este código con tu familia para que se unan.</Text>
      </View>
      <View style={styles.sheet}>
        <View style={styles.sheetBody}>
          <Text style={styles.codeLabel}>Código de invitación</Text>
          <Text style={styles.codeValue} selectable>{code}</Text>
          <Text style={styles.codeHint}>Mantené presionado el código para copiarlo.</Text>
        </View>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.stackLg }]}>
          <MoniButton label="Continuar" onPress={onContinue} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navyDark },
  hero: { alignItems: 'center', paddingHorizontal: spacing.marginPage, paddingVertical: spacing.stackLg, gap: spacing.stackSm },
  heroTitle: { ...typography.headlineMd, color: colors.pureWhite, textAlign: 'center' },
  heroSubtitle: { ...typography.labelMd, color: colors.pureWhite, opacity: 0.65, textAlign: 'center' },
  sheet: { flex: 1, backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadows.modal },
  sheetBody: { padding: spacing.marginPage, paddingTop: spacing.stackLg, gap: spacing.stackMd },
  footer: { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm },
  codeLabel: { ...typography.labelMd, color: colors.slateGray, textAlign: 'center' },
  codeValue: { ...typography.headlineMd, fontSize: 40, letterSpacing: 6, color: colors.navyDark, textAlign: 'center' },
  codeHint: { ...typography.labelSm, color: colors.slateGray, textAlign: 'center' },
});
