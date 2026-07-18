/**
 * DepositSheet — Component
 *
 * @what     Diálogo para aportar plata a una meta. Sin fricción — a diferencia de retirar, nadie
 *           se arrepiente de ahorrar más.
 * @receives 5 props: visible, goal, available, onClose, onConfirm
 * @processes Valida 0 < monto ≤ available. `available` es el disponible sin asignar del pozo Metas
 *           (modelo "pozo financiado, luego repartido" — ver [[planes/psicologia-ux]]); Aportar
 *           reasigna de ahí, no saca plata nueva de Libre.
 *           **Se cayó el listener de teclado propio y el `kbHeight / 2`**: la mitad era un parche
 *           para un popup centrado (subía justo lo necesario para no quedar tapado). Un sheet vive
 *           pegado abajo y sube el alto completo — eso lo hace `MoniSheet`.
 * @returns  JSX — sheet con tono positivo.
 * @props    5: visible, goal, available, onClose, onConfirm
 */
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton, MoniSheet } from '@shared/components';
import type { GoalItem } from '../types';

type Props = {
  visible: boolean;
  goal: GoalItem | null;
  available: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function DepositSheet({ visible, goal, available, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const [monto, setMonto] = useState('');

  useEffect(() => { if (visible) setMonto(''); }, [visible]);

  const parsedMonto = parseFloat(monto.replace(',', '.'));
  const canConfirm = !isNaN(parsedMonto) && parsedMonto > 0 && parsedMonto <= available;

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm(parsedMonto);
    onClose();
  }

  return (
    <MoniSheet visible={visible} onClose={onClose}>
      <View style={[styles.content, { paddingBottom: insets.bottom + spacing.stackLg }]}>

          <Text style={styles.title}>Aportar a {goal?.name}</Text>
          <Text style={styles.body}>Asigná plata desde tu disponible en Metas.</Text>

          <View style={styles.block}>
            <Text style={styles.fieldLabel}>Monto a aportar (disponible $ {available.toLocaleString('es')})</Text>
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

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  content:  { paddingHorizontal: spacing.cardPadding, paddingTop: spacing.stackSm, gap: spacing.stackMd },
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
});
