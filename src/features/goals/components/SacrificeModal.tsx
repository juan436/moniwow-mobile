/**
 * SacrificeModal — Component
 *
 * @what     Diálogo de retiro con fricción: monto + SacrificeSlider + botón cancelar.
 * @receives 4 props: visible, goal, onClose, onConfirm
 * @processes Valida monto > 0 y ≤ goal.current. El slider queda disabled hasta que el monto sea
 *           válido. Al confirmar (hold 3s completo), llama onConfirm(amount) y cierra.
 * @returns  JSX — Modal fade centrado, tono de advertencia (mismo layout que DebtDetailModal).
 * @props    4: visible, goal, onClose, onConfirm
 */
import { useState, useEffect } from 'react';
import { Modal, Pressable, View, Text, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { MoniButton } from '@shared/components';
import { SacrificeSlider } from './SacrificeSlider';
import type { GoalItem } from '../types';

function handlePopupPress() {}

type Props = {
  visible: boolean;
  goal: GoalItem | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function SacrificeModal({ visible, goal, onClose, onConfirm }: Props) {
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <Text style={styles.warning}>⚠️ ¿Vas a sacrificar tu sueño?</Text>
          <Text style={styles.body}>
            Estás a punto de retirar de <Text style={styles.bold}>{goal?.emoji} {goal?.name}</Text>.
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

          <SacrificeSlider progress={100} onConfirm={handleConfirm} disabled={!canConfirm} />

          <MoniButton label="NO, QUIERO MI SUEÑO" onPress={onClose} variant="secondary" />

        </Pressable>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:    { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  warning:  { ...typography.headlineMd, color: colors.alertOrange, textAlign: 'center' },
  body:     { ...typography.bodyMd, color: colors.navyDark, textAlign: 'center' },
  bold:     { ...typography.bodyMdBold, color: colors.navyDark },
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  numInput: {
    height: spacing.inputHeight, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, backgroundColor: colors.pureWhite,
    textAlignVertical: 'center', includeFontPadding: false,
  },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
});
