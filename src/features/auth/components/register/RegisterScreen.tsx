/**
 * RegisterScreen — Component (Screen)
 *
 * @what     Pantalla de registro con layout hero+sheet: hero navyDark superior, form blanco inferior.
 * @receives Ninguna prop — se usa como screen desde app/register.tsx.
 * @processes Delega estado y lógica a useRegister. Si el registro es exitoso navega a
 *           /workspace-setup — el paso 2 del alta, donde se elige cómo se usará la app.
 * @returns  JSX — pantalla hero+bottom-sheet con 4 campos agrupados y footer CTA.
 * @props    —
 */
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useRegister } from '@features/auth/hooks/useRegister';
import { MoniButton, MoniInput, MoniLogo } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const {
    name, email, password, confirmPassword, isLoading, error,
    handleNameChange, handleEmailChange, handlePasswordChange,
    handleConfirmPasswordChange, handleRegister,
  } = useRegister();

  async function handleStart() {
    const user = await handleRegister();
    if (!user) return;
    signIn(user);
    router.replace('/workspace-setup' as never);
  }

  const canSubmit =
    name.length > 0 &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !isLoading;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <MoniLogo width={72} height={39} variant="light" />
        <Text style={styles.heroTitle}>Crear cuenta</Text>
        <Text style={styles.heroSubtitle}>Empieza a controlar tu dinero hoy.</Text>
      </View>

      <View style={styles.sheet}>
        <KeyboardAvoidingView
          style={styles.grow}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.sheetBody}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <MoniInput label="Nombre" value={name} onChangeText={handleNameChange} placeholder="Tu nombre" />
              <MoniInput label="Email" value={email} onChangeText={handleEmailChange} placeholder="tu@email.com" inputType="email" />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <MoniInput label="Contraseña" value={password} onChangeText={handlePasswordChange} placeholder="Mínimo 6 caracteres" inputType="password" />
              <MoniInput label="Confirmar contraseña" value={confirmPassword} onChangeText={handleConfirmPasswordChange} placeholder="Repite tu contraseña" inputType="password" />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.stackLg }]}>
          <MoniButton label="Crear cuenta" onPress={handleStart} disabled={!canSubmit} />
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.switchText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.switchLink}>Inicia sesión</Text>
            </Text>
          </Pressable>
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
  grow: {
    flex: 1,
  },
  sheetBody: {
    padding: spacing.marginPage,
    paddingTop: spacing.stackLg,
    gap: spacing.stackMd,
  },
  section: {
    gap: spacing.stackSm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerLow,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.marginPage,
    paddingTop: spacing.stackSm,
    gap: spacing.stackSm,
  },
  switchText: {
    ...typography.labelMd,
    color: colors.slateGray,
    textAlign: 'center',
  },
  switchLink: {
    ...typography.labelMd,
    color: colors.primary,
  },
});
