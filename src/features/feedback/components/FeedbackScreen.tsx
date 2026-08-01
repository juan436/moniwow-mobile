/**
 * FeedbackScreen — Screen
 *
 * @what     Formulario de una sola pregunta: "¿qué podemos arreglar o añadir?" — buzón de desarrollo.
 * @receives —
 * @processes Envía el texto vía `feedbackActions.send`. Sin lectura, sin historial, sin estado —
 *           el dev extrae los mensajes aparte, la app solo escribe.
 * @returns  JSX — header + textarea + botón Enviar.
 */
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@shared/styles';
import { ScreenHeader, MoniInput, MoniButton } from '@shared/components';
import { feedbackActions } from '@infrastructure/container';

export function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const [descripcion, setDescripcion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const canSend = descripcion.trim() !== '' && !isSending;

  async function handleSend() {
    if (!canSend) return;
    setError(null);
    setIsSending(true);
    try {
      await feedbackActions.send(descripcion.trim());
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Enviar feedback" />
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {sent ? (
          <View style={styles.sentBox}>
            <Text style={styles.sentText}>¡Gracias! Tu feedback llegó.</Text>
            <MoniButton label="Volver" onPress={() => router.back()} />
          </View>
        ) : (
          <>
            <Text style={styles.hint}>¿Qué podemos arreglar o añadir?</Text>
            <MoniInput
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Contanos qué se te ocurre..."
              multiline
              numberOfLines={6}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.action}>
              <MoniButton label="Enviar" onPress={handleSend} disabled={!canSend} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: colors.background },
  body:      { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackLg, gap: spacing.stackMd },
  hint:      { ...typography.bodyMd, color: colors.onSurfaceVariant },
  action:    { marginTop: spacing.stackSm },
  errorText: { ...typography.labelMd, color: colors.error, textAlign: 'center' },
  sentBox:   { alignItems: 'center', gap: spacing.stackMd, paddingTop: spacing.stackLg },
  sentText:  { ...typography.bodyMd, color: colors.onSurface, textAlign: 'center' },
});
