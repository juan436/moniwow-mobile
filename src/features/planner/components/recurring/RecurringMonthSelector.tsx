/**
 * RecurringMonthSelector — Component
 *
 * @what     Selector de mes por nombre (Enero..Diciembre) con flechas — modo Personalizada de
 *           RecurringPaymentDateStep. Más intuitivo que un stepper numérico para elegir mes.
 * @receives 2 props: mes, onChange
 * @processes Flechas clampean 1-12, sin input de texto — solo tap izquierda/derecha.
 * @returns  JSX — label + fila [<] [nombre del mes] [>].
 * @props    2: mes, onChange
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius } from '@shared/styles';

type Props = {
  mes: number;
  onChange: (mes: number) => void;
};

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function RecurringMonthSelector({ mes, onChange }: Props) {
  const atMin = mes <= 1;
  const atMax = mes >= 12;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Mes</Text>
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => onChange(Math.max(1, mes - 1))} disabled={atMin} hitSlop={8}>
          <MaterialIcons name="chevron-left" size={22} color={atMin ? colors.outlineVariant : colors.navyDark} />
        </Pressable>
        <Text style={styles.val}>{MONTH_NAMES[mes - 1]}</Text>
        <Pressable style={styles.btn} onPress={() => onChange(Math.min(12, mes + 1))} disabled={atMax} hitSlop={8}>
          <MaterialIcons name="chevron-right" size={22} color={atMax ? colors.outlineVariant : colors.navyDark} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.stackXs },
  label:   { ...typography.labelSm, color: colors.onSurfaceVariant },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.pureWhite,
    overflow: 'hidden',
  },
  btn: { width: 44, alignItems: 'center', justifyContent: 'center', height: '100%' },
  val: {
    flex: 1,
    textAlign: 'center',
    ...typography.bodyMd,
    color: colors.onSurface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.outlineVariant,
  },
});
