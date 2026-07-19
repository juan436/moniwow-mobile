/**
 * TransferSheet — Component
 *
 * @what     Modal bottom sheet para mover fondos entre jarras. Dos modos: **transferir** (origen fijo
 *           = `fromJar`, se elige destino) y **reequilibrar** (`rebalanceInto` set: destino fijo = la
 *           jarra en rojo, se elige el ORIGEN con fondos — M03 §3).
 * @receives 6 props: visible, fromJar, rebalanceInto?, jars, onClose, onTransfer
 * @processes `source` = de dónde sale el dinero: `fromJar` en transferir, la jarra elegida en
 *           reequilibrar. Valida monto > 0 y ≤ saldo del `source` (regla de TransferFunds.ts). Si el
 *           `source` es blindado, "Transferir/Reequilibrar" se reemplaza por SacrificeSlider. Los chips
 *           usan ícono real + `emeraldSuccess` al seleccionar. `onTransfer(pickedId, amount)`: pickedId
 *           es el destino en transferir y el origen en reequilibrar (JarsScreen decide la dirección).
 *           El chrome (sheet/backdrop/header/teclado/GestureHandlerRootView) lo pone `MoniSheet`.
 * @returns  JSX — bottom sheet con card fija, selector, input monto y CTA.
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
  rebalanceInto?: JarDisplay | null;
  jars: JarDisplay[];
  onClose: () => void;
  onTransfer: (pickedId: string, amount: number) => void;
};

export function TransferSheet({ visible, fromJar, rebalanceInto, jars, onClose, onTransfer }: Props) {
  const insets = useSafeAreaInsets();
  const [toId, setToId]     = useState('');
  const [monto, setMonto]   = useState('');

  useEffect(() => { if (visible) { setToId(''); setMonto(''); } }, [visible]);

  const isRebalance = !!rebalanceInto;
  // Origen del dinero: en reequilibrar es la jarra elegida (toId); en transferir, el fromJar fijo.
  const source  = isRebalance ? jars.find((j) => j.id === toId) ?? null : fromJar;
  const options = isRebalance
    ? jars.filter((j) => j.id !== rebalanceInto.id && j.balance > 0)  // orígenes con fondos
    : jars.filter((j) => j.id !== fromJar?.id);                       // destinos
  const parsedMonto = parseFloat(monto.replace(',', '.'));
  const canSave = toId !== '' && !isNaN(parsedMonto) && parsedMonto > 0 &&
    !!source && parsedMonto <= source.balance;

  function handleTransfer() {
    if (!canSave) return;
    onTransfer(toId, parsedMonto);
    onClose();
  }

  return (
    <MoniSheet visible={visible} onClose={onClose} title={isRebalance ? 'Reequilibrar' : 'Transferir fondos'}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackSm }]} keyboardShouldPersistTaps="handled">
        <View style={styles.fromCard}>
          <Text style={styles.fromLabel}>{isRebalance ? 'Para cubrir' : 'Desde'}</Text>
          <Text style={styles.fromName}>{isRebalance ? rebalanceInto?.name : fromJar?.name}</Text>
          <Text style={[styles.fromBalance, isRebalance && styles.deficit]}>
            {isRebalance
              ? `Faltan $ ${Math.abs(rebalanceInto?.balance ?? 0).toLocaleString('es')}`
              : `$ ${fromJar?.balance.toLocaleString('es')} disponible`}
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.fieldLabel}>{isRebalance ? 'Desde' : 'Hacia'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jarRow}>
            {options.map((j) => (
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

        {source?.isBlindado
          ? <SacrificeSlider progress={100} onConfirm={handleTransfer} disabled={!canSave} />
          : <MoniButton label={isRebalance ? 'Reequilibrar' : 'Transferir'} onPress={handleTransfer} disabled={!canSave} />
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
  deficit:     { color: colors.error },
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
