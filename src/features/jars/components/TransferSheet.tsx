/**
 * TransferSheet — Component
 *
 * @what     Modal bottom sheet para transferir fondos de una jarra a otra.
 * @receives 5 props: visible, fromJar, jars, onClose, onTransfer
 * @processes Selector de jarra destino (excluye origen) + monto. Chips usan ícono real
 *           (`JarDisplay.iconName`) + `emeraldSuccess` al seleccionar — estándar visual de jarra
 *           en toda la app (antes solo texto + navyDark). Valida monto > 0 y ≤ saldo origen,
 *           misma regla que TransferFunds.ts — mock-stage. Sheet sube con teclado al enfocar
 *           Monto. Si `fromJar.isBlindado`, "Transferir" se reemplaza por SacrificeSlider.
 *           GestureHandlerRootView propio: el Modal de RN aísla gesture-handler en Android.
 * @returns  JSX — bottom sheet con resumen origen, selector destino, input monto y CTA.
 * @props    5: visible, fromJar, jars, onClose, onTransfer
 */
import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, TextInput, Keyboard, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniButton, SacrificeSlider } from '@shared/components';
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
  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => { if (visible) { setToId(''); setMonto(''); } }, [visible]);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKbHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKbHeight(0),
    );
    return () => { show.remove(); hide.remove(); };
  }, []);

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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <GestureHandlerRootView style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={[styles.sheet, { marginBottom: kbHeight }]} onStartShouldSetResponder={() => true}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>Transferir fondos</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <MaterialIcons name="close" size={24} color={colors.slateGray} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled">
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
          </View>
        </Pressable>
        <View style={[styles.navBarCover, { height: insets.bottom }]} />
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  backdrop:    { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet:       { backgroundColor: colors.pureWhite, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, maxHeight: '90%' },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackSm, marginBottom: spacing.stackXs },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackXs, paddingBottom: spacing.stackSm,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  title: { ...typography.headlineMd, color: colors.navyDark },
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
