/**
 * LoginScreen — Component (Screen)
 *
 * @what     Pantalla de inicio de sesión con layout hero+sheet: hero navyDark superior, form blanco inferior.
 * @receives Ninguna prop — se usa como screen desde app/login.tsx.
 * @processes Delega estado y lógica a useLogin. Si el login es exitoso, **guarda la sesión en el
 *           contexto** (`signIn`) y navega a /(tabs). Sin el `signIn`, el token queda guardado pero
 *           la app seguiría creyendo que no hay nadie dentro.
 * @returns  JSX — pantalla hero+bottom-sheet con formulario email+contraseña y footer CTA.
 * @props    —
 */
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useLogin } from '@features/auth/hooks/useLogin';
import { MoniButton, MoniInput, MoniLogo } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import { colors, typography, spacing, radius, shadows } from '@shared/styles';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const {
    email, password, isLoading, error,
    handleEmailChange, handlePasswordChange, handleLogin,
  } = useLogin();

  async function handleStart() {
    const user = await handleLogin();
    if (!user) return;
    signIn(user);
    router.replace('/(tabs)' as never);
  }

  const canSubmit = email.length > 0 && password.length > 0 && !isLoading;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <MoniLogo width={88} height={48} variant="light" />
        <Text style={styles.heroTitle}>Bienvenido de vuelta</Text>
        <Text style={styles.heroSubtitle}>Tu dinero te espera.</Text>
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
              <MoniInput label="Email" value={email} onChangeText={handleEmailChange} placeholder="tu@email.com" inputType="email" />
              <MoniInput label="Contraseña" value={password} onChangeText={handlePasswordChange} placeholder="Mínimo 6 caracteres" inputType="password" />
            </View>

            <Pressable hitSlop={8} style={styles.forgotWrap}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.stackLg }]}>
          <MoniButton label="Iniciar sesión" onPress={handleStart} disabled={!canSubmit} />
          <Pressable onPress={() => router.push('/register' as never)} hitSlop={8}>
            <Text style={styles.switchText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.switchLink}>Regístrate</Text>
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
  forgotWrap: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    ...typography.labelMd,
    color: colors.primary,
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
