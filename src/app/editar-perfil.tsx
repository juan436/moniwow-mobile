/**
 * EditarPerfilScreen — Screen (/editar-perfil)
 *
 * @what     Formulario V1 para editar nombre, apellido, correo y contraseña del usuario.
 * @receives —
 * @processes Estado local sembrado desde useProfile (mock, sin persistencia real aún). "Guardar"
 *           vuelve atrás — TODO backend. Contraseña vacía = "sin cambios". ScrollView sube con teclado.
 * @returns  JSX — header + formulario + botón Guardar.
 */
import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@shared/styles';
import { ScreenHeader, MoniInput, MoniButton } from '@shared/components';
import { useProfile } from '@shared/hooks/useProfile';

export default function EditarPerfilScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName]   = useState(profile.lastName);
  const [email, setEmail]         = useState(profile.email);
  const [password, setPassword]   = useState('');

  const canSave = firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== '';

  function handleSave() {
    if (!canSave) return;
    // TODO backend: persistir cambios de perfil.
    router.back();
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
        <MoniInput label="Nombre" value={firstName} onChangeText={setFirstName} placeholder="Tu nombre" />
        <MoniInput label="Apellido" value={lastName} onChangeText={setLastName} placeholder="Tu apellido" />
        <MoniInput label="Correo" value={email} onChangeText={setEmail} placeholder="tucorreo@ejemplo.com" inputType="email" />
        <MoniInput label="Nueva contraseña" value={password} onChangeText={setPassword} placeholder="Dejar vacío para no cambiar" inputType="password" />
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
});
