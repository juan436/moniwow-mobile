/**
 * TransferSheet — Component
 *
 * @what     Modal bottom sheet para transferir fondos de una jarra a otra.
 * @receives 5 props: visible, fromJar, jars, onClose, onTransfer
 * @processes Selector de jarra destino (excluye origen) + monto. Chips usan ícono real
 *           (`JarDisplay.iconName`) + `emeraldSuccess` al seleccionar — estándar visual de jarra
 *           en toda la app. Valida monto > 0 y ≤ saldo origen, misma regla que TransferFunds.ts —
 *           mock-stage. Si `fromJar.isBlindado`, "Transferir" se reemplaza por SacrificeSlider.
 *           El chrome (sheet + backdrop + header + teclado + GestureHandlerRootView) lo pone
 *           `MoniSheet` — por eso el slider de gesture-handler sigue vivo sin montar el suyo.
 * @returns  JSX — bottom sheet con resumen origen, selector destino, input monto y CTA.
 * @props    5: visible, fromJar, jars, onClose, onTransfer
 */
import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton, SacrificeSlider, MoniSheet } from '@shared/components';
import type { JarDisplay } from '../types';

type Props = {
  visible: boolean;
  fromJar: JarDisplay | null;
  jars: JarDisplay[];
  onClose: () => void;
  onTransfer: (toId: string, amount: number) => void;
};

export function TransferSheet({ visible, fromJar, jars, onClose, onTransfer }: Props) {
  const insets = useSafeAreaInsets();
  const [toId, setToId]     = useState('');
  const [monto, setMonto]   = useState('');

  useEffect(() => { if (visible) { setToId(''); setMonto(''); } }, [visible]);

  const destinations = jars.filter((j) => j.id !== fromJar?.id);
  const parsedMonto  = parseFloat(monto.replace(',', '.'));
  const canSave = toId !== '' && !isNaN(parsedMonto) && parsedMonto > 0 &&
    !!fromJar && parsedMonto <= fromJar.balance;

  function handleTransfer() {
    if (!canSave) return;
    onTransfer(toId, parsedMonto);
    onClose();
  }

  return (
    <MoniSheet visible={visible} onClose={onClose} title="Transferir fondos">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackSm }]} keyboardShouldPersistTaps="handled">
        <View style={styles.fromCard}>
          <Text style={styles.fromLabel}>Desde</Text>
          <Text style={styles.fromName}>{fromJar?.name}</Text>
          <Text style={styles.fromBalance}>$ {fromJar?.balance.toLocaleString('es')} disponible</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.fieldLabel}>Hacia</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jarRow}>
            {destinations.map((j) => (
              <Pressable key={j.id} style={[styles.jarChip, toId === j.id && styles.jarChipActive]} onPress={() => setToId(j.id)}>
                {j.iconName && <MaterialIcons name={j.iconName} size={16} color={toId === j.id ? colors.pureWhite : colors.slateGray} />}
                <Text style={[styles.jarChipText, toId === j.id && styles.jarChipTextActive]}>{j.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.block}>
          <Text style={styles.fieldLabel}>Monto</Text>
          <TextInput style={styles.numInput} value={monto} onChangeText={setMonto} placeholder="$ 0.00" placeholderTextColor={colors.outlineVariant} keyboardType="numeric" />
        </View>

        {fromJar?.isBlindado
          ? <SacrificeSlider progress={100} onConfirm={handleTransfer} disabled={!canSave} />
          : <MoniButton label="Transferir" onPress={handleTransfer} disabled={!canSave} />
        }
      </ScrollView>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:  { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
  fromCard: {
    backgroundColor: colors.surfaceContainerLow, borderRadius: radius.card,
    padding: spacing.cardPadding, gap: spacing.stackXs,
  },
  fromLabel:   { ...typography.labelSm, color: colors.slateGray },
  fromName:    { ...typography.bodyMdBold, color: colors.navyDark },
  fromBalance: { ...typography.labelMd, color: colors.emeraldSuccess },
  block:       { gap: spacing.stackXs },
  fieldLabel:  { ...typography.labelSm, color: colors.onSurfaceVariant },
  jarRow:      { flexDirection: 'row', gap: spacing.stackSm },
  jarChip:     { flexDirection: 'row', alignItems: 'center', gap: spacing.stackXs, paddingVertical: spacing.stackSm, paddingHorizontal: spacing.gutter, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant },
  jarChipActive:    { backgroundColor: colors.emeraldSuccess, borderColor: colors.emeraldSuccess },
  jarChipText:      { ...typography.labelMd, color: colors.slateGray },
  jarChipTextActive: { color: colors.pureWhite },
  numInput: {
    height: spacing.inputHeight, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, backgroundColor: colors.pureWhite,
    textAlignVertical: 'center', includeFontPadding: false,
  },
});
