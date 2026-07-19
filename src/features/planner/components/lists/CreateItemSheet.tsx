/**
 * CreateItemSheet — Component
 *
 * @what     Modal bottom sheet para añadir un ítem a una lista existente.
 * @receives 5 props: visible, listaId, listaName, onClose, onAdd(listId, name, approxAmount?)
 * @processes Form local: nombre (requerido), montoAprox (opcional). Valida nombre no vacío. Al guardar
 *           llama `onAdd` (persiste vía store→repo). El monto se parsea a número; vacío/inválido → sin
 *           monto (opcional en el modelo). El chrome (sheet/backdrop/header/teclado) lo pone `MoniSheet`.
 * @returns  JSX — bottom sheet slide-up con campos y CTA.
 * @props    5: visible, listaId, listaName, onClose, onAdd
 */
import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton, MoniSheet } from '@shared/components';

type Form = { nombre: string; montoAprox: string };
function emptyForm(): Form { return { nombre: '', montoAprox: '' }; }

type Props = { visible: boolean; listaId: string; listaName: string; onClose: () => void; onAdd: (listId: string, name: string, approxAmount?: number) => void };

export function CreateItemSheet({ visible, listaId, listaName, onClose, onAdd }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Form>(emptyForm);

  useEffect(() => { if (visible) setForm(emptyForm()); }, [visible]);

  function setField<K extends keyof Form>(key: K, val: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const canSave = form.nombre.trim() !== '';

  function handleSave() {
    if (!canSave) return;
    const amount = parseFloat(form.montoAprox.replace(',', '.'));
    onAdd(listaId, form.nombre.trim(), Number.isFinite(amount) && amount > 0 ? amount : undefined);
    onClose();
  }

  return (
    <MoniSheet visible={visible} onClose={onClose} title={`Añadir a ${listaName}`}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <MoniInput label="Nombre del ítem" value={form.nombre} onChangeText={(v) => setField('nombre', v)} placeholder="ej. Leche" />
        <View style={styles.block}>
          <Text style={styles.fieldLabel}>Monto aproximado <Text style={styles.optional}>(opcional)</Text></Text>
          <TextInput
            style={styles.numInput}
            value={form.montoAprox}
            onChangeText={(v) => setField('montoAprox', v)}
            placeholder="$ 0.00"
            placeholderTextColor={colors.outlineVariant}
            keyboardType="numeric"
          />
        </View>
        <MoniButton label="Añadir ítem" onPress={handleSave} disabled={!canSave} />
      </ScrollView>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:       { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
  block:      { gap: spacing.stackXs },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  optional:   { ...typography.labelSm, color: colors.outlineVariant },
  numInput: {
    height: spacing.inputHeight, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface, backgroundColor: colors.pureWhite,
    textAlignVertical: 'center', includeFontPadding: false,
  },
});
