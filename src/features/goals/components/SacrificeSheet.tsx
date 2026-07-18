/**
 * SacrificeSheet — Component
 *
 * @what     Diálogo de retiro con fricción: monto + destino + SacrificeSlider + botón cancelar.
 * @receives 4 props: visible, goal, onClose, onConfirm
 * @processes Valida monto > 0 y ≤ goal.current. El slider queda disabled hasta que el monto sea
 *           válido. Al confirmar (hold 3s completo), llama onConfirm(amount) y cierra. Muestra
 *           explícito "Este dinero va a tu jarra Libre" — antes retiraba en silencio sin decir a
 *           dónde caía el dinero (`useGoals.handleWithdraw` siempre lo manda a Libre, regla fija,
 *           sin selector — mantenerlo simple es intencional, la fricción del sacrificio ya
 *           desincentiva bastante).
 *           **El `GestureHandlerRootView` ya no vive acá**: lo pone `MoniSheet`, que lo monta
 *           siempre dentro del Modal. Hace falta porque RN renderiza el Modal en ventana nativa
 *           separada en Android y gesture-handler no detecta touches ahí sin su propio root — sin
 *           eso el slider muere (ver adr_gesture_handler). Al vivir en el chrome, no hay forma de
 *           olvidárselo.
 * @returns  JSX — sheet con tono de advertencia.
 * @props    4: visible, goal, onClose, onConfirm
 */
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton, MoniSheet, SacrificeSlider } from '@shared/components';
import type { GoalItem } from '../types';

type Props = {
  visible: boolean;
  goal: GoalItem | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function SacrificeSheet({ visible, goal, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const [monto, setMonto] = useState('');

  useEffect(() => { if (visible) setMonto(''); }, [visible]);

  const parsedMonto = parseFloat(monto.replace(',', '.'));
  const canConfirm = !!goal && !isNaN(parsedMonto) && parsedMonto > 0 && parsedMonto <= goal.current;

  function handleConfirm() {
    if (!canConfirm || !goal) return;
    onConfirm(parsedMonto);
  }

  return (
    <MoniSheet visible={visible} onClose={onClose}>
      <View style={[styles.content, { paddingBottom: insets.bottom + spacing.stackMd }]}>

            <Text style={styles.warning}>⚠️ ¿Vas a sacrificar tu meta?</Text>
            <Text style={styles.body}>
              Estás a punto de retirar de <Text style={styles.bold}>{goal?.name}</Text>.
              Esto apagará estrellas ganadas.
            </Text>

            <View style={styles.block}>
              <Text style={styles.fieldLabel}>Monto a retirar (disponible $ {goal?.current.toLocaleString('es')})</Text>
              <TextInput
                style={styles.numInput}
                value={monto}
                onChangeText={setMonto}
                placeholder="$ 0.00"
                placeholderTextColor={colors.outlineVariant}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.destino}>
              <MaterialIcons name="account-balance-wallet" size={16} color={colors.slateGray} />
              <Text style={styles.destinoText}>Este dinero irá a tu jarra Libre</Text>
            </View>

            <SacrificeSlider progress={100} onConfirm={handleConfirm} disabled={!canConfirm} />

            <MoniButton label="No, quiero mi meta" onPress={onClose} variant="secondary" />

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  content:  { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackMd },
  warning:  { ...typography.headlineMd, color: colors.alertOrange, textAlign: 'center' },
  body:     { ...typography.bodyMd, color: colors.navyDark, textAlign: 'center' },
  bold:     { ...typography.bodyMdBold, color: colors.navyDark },
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  destino:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, alignSelf: 'center' },
  destinoText: { ...typography.labelSm, color: colors.slateGray },
  numInput: {
    height: spacing.inputHeight, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, backgroundColor: colors.pureWhite,
    textAlignVertical: 'center', includeFontPadding: false,
  },
});
