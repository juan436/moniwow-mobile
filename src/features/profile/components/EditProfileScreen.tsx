/**
 * EditProfileScreen — Screen
 *
 * @what     Formulario para editar nombre, correo y contraseña del usuario logueado.
 * @receives —
 * @processes Estado local sembrado desde `useProfile` (real, `AuthProvider.user`). "Guardar" llama
 *           `authRepository.updateProfile` (FB-020, `PATCH /auth/me`) y refresca el contexto con
 *           `signIn(updated)` — si no, `AppTopBar`/`ProfileSheet` seguirían mostrando el dato viejo
 *           hasta reiniciar la app. **Un solo campo "Nombre"**, no firstName/lastName — así lo
 *           guarda el backend, inventar el split era mentirle al modelo. Nueva contraseña exige la
 *           actual (el servidor la verifica; acá solo se manda si se escribió algo).
 * @returns  JSX — header + formulario + botón Guardar.
 */
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@shared/styles';
import { ScreenHeader, MoniInput, MoniButton } from '@shared/components';
import { useProfile } from '@shared/hooks/useProfile';
import { useAuth } from '@shared/hooks/useAuth';
import { authRepository } from '@infrastructure/container';

export function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { signIn } = useAuth();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = name.trim() !== '' && email.trim() !== '' && !isSaving;

  async function handleSave() {
    if (!canSave) return;
    setError(null);
    setIsSaving(true);
    try {
      const updated = await authRepository.updateProfile({
        name: name.trim(),
        email: email.trim(),
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      });
      signIn(updated);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Editar perfil" />
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <MoniInput label="Nombre" value={name} onChangeText={setName} placeholder="Tu nombre" />
        <MoniInput label="Correo" value={email} onChangeText={setEmail} placeholder="tucorreo@ejemplo.com" inputType="email" />
        <MoniInput label="Contraseña actual" value={currentPassword} onChangeText={setCurrentPassword} placeholder="Solo si cambiás la contraseña" inputType="password" />
        <MoniInput label="Nueva contraseña" value={newPassword} onChangeText={setNewPassword} placeholder="Dejar vacío para no cambiar" inputType="password" />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.action}>
          <MoniButton label="Guardar cambios" onPress={handleSave} disabled={!canSave} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  body:   { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackLg, gap: spacing.stackMd },
  action: { marginTop: spacing.stackSm },
  errorText: { ...typography.labelMd, color: colors.error, textAlign: 'center' },
});
