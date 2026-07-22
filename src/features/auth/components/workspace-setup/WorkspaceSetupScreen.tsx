/**
 * WorkspaceSetupScreen — Component (Screen)
 *
 * @what     Paso 2 del registro: elegir cómo se usa MoniWow. Layout hero+sheet.
 * @receives Ninguna prop — se usa como screen desde app/workspace-setup.tsx.
 * @processes Delega selección y confirmación a useWorkspaceSetup. La opción "join" muestra un campo
 *           de código de invitación en vez de crear un espacio nuevo. Al confirmar entra a la app
 *           (/(tabs)): la cuenta ya existe, este era el último paso del alta.
 * @returns  JSX — pantalla hero+bottom-sheet con 3 opciones de workspace y footer CTA.
 * @props    —
 */
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useWorkspaceSetup } from '@features/auth/hooks/useWorkspaceSetup';
import { MoniButton, MoniInput, MoniLogo } from '@shared/components';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { WorkspaceOptionCard } from './WorkspaceOptionCard';
import type { WorkspaceOption } from './WorkspaceOptionCard';

const OPTIONS: WorkspaceOption[] = [
  {
    id: 'individual',
    icon: 'person',
    title: 'Solo yo',
    description: 'Gestiona tus finanzas personales. Tus jarras, tus metas, tu ritmo.',
  },
  {
    id: 'hogar',
    icon: 'group',
    title: 'Con mi familia',
    description: 'Espacio compartido con tu pareja o hijos. Tú eres el Representante.',
  },
  {
    id: 'join',
    icon: 'vpn-key',
    title: 'Ya tengo un hogar',
    description: 'Únete con el código que te compartió tu familia.',
  },
];

export function WorkspaceSetupScreen() {
  const insets = useSafeAreaInsets();
  const { selected, inviteCode, isLoading, error, handleSelect, handleChangeCode, handleConfirm } =
    useWorkspaceSetup();
  const canStart = selected === 'join' ? inviteCode.trim().length > 0 : !!selected;

  async function handleStart() {
    const success = await handleConfirm();
    if (success) router.replace('/(tabs)' as never);
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <MoniLogo width={72} height={39} variant="light" />
        <Text style={styles.heroTitle}>¿Cómo quieres{'\n'}usar MoniWow?</Text>
        <Text style={styles.heroSubtitle}>Puedes cambiarlo después desde ajustes.</Text>
      </View>

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.sheetBody}
          showsVerticalScrollIndicator={false}
        >
          {OPTIONS.map((opt) => (
            <WorkspaceOptionCard
              key={opt.id}
              option={opt}
              active={selected === opt.id}
              onPress={handleSelect}
            />
          ))}
          {selected === 'join' ? (
            <MoniInput
              value={inviteCode}
              onChangeText={handleChangeCode}
              placeholder="Ej. A1B2C3"
              label="Código de invitación"
            />
          ) : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.stackLg }]}>
          <MoniButton label="Comenzar" onPress={handleStart} disabled={!canStart || isLoading} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.navyDark,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.marginPage,
    paddingVertical: spacing.stackLg,
    gap: spacing.stackSm,
  },
  heroTitle: {
    ...typography.headlineMd,
    color: colors.pureWhite,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.labelMd,
    color: colors.pureWhite,
    opacity: 0.65,
    textAlign: 'center',
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.pureWhite,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...shadows.modal,
  },
  sheetBody: {
    padding: spacing.marginPage,
    paddingTop: spacing.stackLg,
    gap: spacing.stackMd,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.marginPage,
    paddingTop: spacing.stackSm,
  },
});
