/**
 * ProgramarCompromisoModal — Component
 *
 * @what     Modal formulario para crear un recurrente: Ingreso, Gasto o Deuda.
 * @receives 3 props: visible, initialType, onClose
 * @processes Form local. Tipo pre-seleccionado por initialType. Campos condicionales por tipo.
 * @returns  JSX — bottom sheet slide-up con selector tipo, campos, jarra y CTA.
 * @props    3: visible, initialType, onClose
 */
import { useState, useEffect } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView,
  TextInput, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { MoniInput, MoniButton, StepperInput } from '@shared/components';
import type { AgendaFilter, NuevoCompromisoForm, CompromisoFrecuencia, CompromisoJarra, RecurrenteDisplay } from '../../types';

const TIPOS: AgendaFilter[] = ['ingresos', 'gastos', 'deudas'];
const TIPO_LABEL: Record<AgendaFilter, string> = { ingresos: 'Ingreso', gastos: 'Gasto', deudas: 'Deuda' };
const JARRAS: { key: CompromisoJarra; label: string }[] = [
  { key: 'hogar',       label: '🏠 Hogar'       },
  { key: 'ahorro',      label: '💰 Ahorro'      },
  { key: 'libre',       label: '🍃 Libre'       },
  { key: 'transporte',  label: '🚗 Transporte'  },
  { key: 'salud',       label: '❤️ Salud'       },
  { key: 'educacion',   label: '📚 Educación'   },
  { key: 'viajes',      label: '✈️ Viajes'      },
  { key: 'emergencias', label: '🛡️ Emergencias' },
  { key: 'ocio',        label: '🎮 Ocio'        },
];
const FRECUENCIAS: { key: CompromisoFrecuencia; label: string }[] = [
  { key: 'indefinido', label: 'Indefinido'  },
  { key: 'cuotas',     label: 'Por cuotas' },
];

function emptyForm(tipo: AgendaFilter): NuevoCompromisoForm {
  return { tipo, nombre: '', monto: '', dia: 1, mes: 1, frecuencia: 'indefinido', cuotasTotales: 12, cuotasPagadas: 0, jarra: 'libre' };
}

type Props = { visible: boolean; initialType: AgendaFilter; onClose: () => void; editItem?: RecurrenteDisplay };

export function ProgramarCompromisoModal({ visible, initialType, onClose, editItem }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<NuevoCompromisoForm>(() => emptyForm(initialType));

  useEffect(() => {
    if (!visible) return;
    setForm(editItem
      ? { ...emptyForm(editItem.filter), nombre: editItem.name, monto: editItem.amount.toString(), dia: editItem.day }
      : emptyForm(initialType));
  }, [visible, initialType, editItem]);

  function setField<K extends keyof NuevoCompromisoForm>(key: K, val: NuevoCompromisoForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const isDeuda    = form.tipo === 'deudas';
  const showCuotas = !isDeuda && form.frecuencia === 'cuotas';
  const canSave    = form.nombre.trim() !== '' && form.monto.trim() !== '';

  function handleSave() {
    if (!canSave) return;
    // TODO: conectar use case cuando backend esté listo
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>

          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{editItem ? 'Editar compromiso' : 'Programar compromiso'}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={colors.slateGray} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
            <View style={styles.segRow}>
              {TIPOS.map((t) => (
                <Pressable key={t} style={[styles.seg, form.tipo === t && styles.segActive]} onPress={() => setField('tipo', t)}>
                  <Text style={[styles.segText, form.tipo === t && styles.segTextActive]}>{TIPO_LABEL[t]}</Text>
                </Pressable>
              ))}
            </View>
            <MoniInput
              label={isDeuda ? 'Acreedor' : 'Nombre'}
              value={form.nombre}
              onChangeText={(v) => setField('nombre', v)}
              placeholder={isDeuda ? 'ej. Banco Visa' : 'ej. Netflix'}
            />
            <View style={styles.block}>
              <Text style={styles.fieldLabel}>Monto</Text>
              <TextInput style={styles.numInput} value={form.monto} onChangeText={(v) => setField('monto', v)} placeholder="$ 0.00" placeholderTextColor={colors.outlineVariant} keyboardType="numeric" />
            </View>
            <View style={styles.row2}>
              <View style={styles.flex1}>
                <StepperInput label="Día" value={form.dia} min={1} max={31} onChange={(v) => setField('dia', v)} />
              </View>
              <View style={styles.flex1}>
                <StepperInput label="Mes" value={form.mes} min={1} max={12} onChange={(v) => setField('mes', v)} />
              </View>
            </View>
            {isDeuda && (
              <View style={styles.row2}>
                <View style={styles.flex1}>
                  <StepperInput label="Cuotas totales" value={form.cuotasTotales} min={1} max={120} onChange={(v) => setField('cuotasTotales', v)} />
                </View>
                <View style={styles.flex1}>
                  <StepperInput label="Cuotas pagadas" value={form.cuotasPagadas} min={0} max={form.cuotasTotales - 1} onChange={(v) => setField('cuotasPagadas', v)} />
                </View>
              </View>
            )}
            {!isDeuda && (
              <View style={styles.block}>
                <Text style={styles.fieldLabel}>Frecuencia</Text>
                <View style={styles.segRow}>
                  {FRECUENCIAS.map((f) => (
                    <Pressable key={f.key} style={[styles.seg, form.frecuencia === f.key && styles.segActive]} onPress={() => setField('frecuencia', f.key)}>
                      <Text style={[styles.segText, form.frecuencia === f.key && styles.segTextActive]}>{f.label}</Text>
                    </Pressable>
                  ))}
                </View>
                {showCuotas && (
                  <StepperInput label="Cuotas totales" value={form.cuotasTotales} min={1} max={120} onChange={(v) => setField('cuotasTotales', v)} />
                )}
              </View>
            )}
            <View style={styles.block}>
              <Text style={styles.fieldLabel}>Jarra de pago</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segRow}>
                {JARRAS.map((j) => (
                  <Pressable key={j.key} style={[styles.jarraItem, form.jarra === j.key && styles.segActive]} onPress={() => setField('jarra', j.key)}>
                    <Text style={[styles.segText, form.jarra === j.key && styles.segTextActive]}>{j.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <MoniButton label="Guardar programación" onPress={handleSave} disabled={!canSave} />

          </ScrollView>
        </View>
      </Pressable>
      <View style={[styles.navBarCover, { height: insets.bottom }]} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: `${colors.navyDark}8C` },
  sheet: {
    backgroundColor: colors.pureWhite,
    borderTopLeftRadius: radius.card * 2,
    borderTopRightRadius: radius.card * 2,
    maxHeight: '90%',
  },
  navBarCover: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.black },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant, alignSelf: 'center', marginTop: spacing.stackMd, marginBottom: spacing.stackSm },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm, paddingBottom: spacing.stackMd,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '44',
  },
  sheetTitle: { ...typography.headlineMd, color: colors.navyDark },
  body:       { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd, paddingBottom: spacing.stackLg },
  segRow:     { flexDirection: 'row', gap: spacing.stackSm },
  seg:        { flex: 1, paddingVertical: spacing.stackSm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  jarraItem:  { paddingVertical: spacing.stackSm, paddingHorizontal: spacing.gutter, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
  segActive:     { backgroundColor: colors.navyDark, borderColor: colors.navyDark },
  segText:       { ...typography.labelMd, color: colors.slateGray },
  segTextActive: { color: colors.pureWhite },
  row2:      { flexDirection: 'row', gap: spacing.stackMd },
  flex1:     { flex: 1, gap: spacing.stackXs },
  block:     { gap: spacing.stackSm },
  fieldLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  numInput: {
    height: spacing.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.gutter,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
    backgroundColor: colors.pureWhite,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
