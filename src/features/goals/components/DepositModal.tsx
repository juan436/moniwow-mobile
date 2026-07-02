/**
 * DepositModal — Component
 *
 * @what     Diálogo para aportar plata a una meta. Sin fricción — a diferencia de retirar, nadie
 *           se arrepiente de ahorrar más.
 * @receives 4 props: visible, goal, onClose, onConfirm
 * @processes Valida monto > 0. Al confirmar, llama onConfirm(amount) y cierra.
 * @returns  JSX — Modal fade centrado, tono positivo.
 * @props    4: visible, goal, onClose, onConfirm
 */
import { useState, useEffect } from 'react';
import { Modal, Pressable, View, Text, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius, shadows } from '@shared/styles';
import { MoniButton } from '@shared/components';
import type { GoalItem } from '../types';

function handlePopupPress() {}

type Props = {
  visible: boolean;
  goal: GoalItem | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function DepositModal({ visible, goal, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const [monto, setMonto] = useState('');

  useEffect(() => { if (visible) setMonto(''); }, [visible]);

  const parsedMonto = parseFloat(monto.replace(',', '.'));
  const canConfirm = !isNaN(parsedMonto) && parsedMonto > 0;

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm(parsedMonto);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={handlePopupPress}>

          <Text style={styles.title}>Aportar a {goal?.emoji} {goal?.name}</Text>
          <Text style={styles.body}>Sumá plata a tu meta. Se transfiere desde Libre.</Text>

          <View style={styles.block}>
            <Text style={styles.fieldLabel}>Monto a aportar</Text>
            <TextInput
              style={styles.numInput}
              value={monto}
              onChangeText={setMonto}
              placeholder="$ 0.00"
              placeholderTextColor={colors.outlineVariant}
              keyboardType="numeric"
              autoFocus
            />
          </View>

          <MoniButton label="Aportar" onPress={handleConfirm} disabled={!canConfirm} />

        </Pressable>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: `${colors.navyDark}8C`, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.marginPage },
  popup:    { backgroundColor: colors.pureWhite, borderRadius: radius.card, width: '100%', padding: spacing.cardPadding, gap: spacing.stackMd, ...shadows.modal },
  title:    { ...typography.headlineMd, color: colors.navyDark, textAlign: 'center' },
  body:     { ...typography.bodyMd, color: colors.slateGray, textAlign: 'center' },
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
