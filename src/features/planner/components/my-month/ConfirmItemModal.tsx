/**
 * ConfirmItemModal — Component
 *
 * @what     Confirmación antes de escribir un compromiso en el libro (Pagar / ¡Llegó! / pagar cuota).
 * @receives 3 props: item, onConfirm, onCancel
 * @processes El botón de la agenda escribe un movimiento REAL e irreversible: baja una jarra y, si es
 *           una cuota, avanza la deuda. Un toque por error no se puede deshacer todavía, así que
 *           nada se escribe sin un OK explícito. Muestra lo que va a pasar: cuánto, de qué jarra sale
 *           (o a cuál entra, si es un ingreso) y qué compromiso se salda.
 * @returns  JSX — sheet; `visible` = hay item que confirmar.
 * @props    3: item, onConfirm, onCancel
 */
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, typography, spacing, radius, sizes } from '@shared/styles';
import { MoniSheet } from '@shared/components';
import type { AgendaFilter, AgendaItemDisplay } from '../../types';

type Copy = { title: string; jarLabel: string; cta: string };

const COPY: Record<AgendaFilter, Copy> = {
  gastos:   { title: '¿Pagar este gasto?',    jarLabel: 'Sale de',  cta: 'Pagar' },
  ingresos: { title: '¿Confirmar que llegó?', jarLabel: 'Entra en', cta: 'Sí, llegó' },
  deudas:   { title: '¿Pagar esta cuota?',    jarLabel: 'Sale de',  cta: 'Pagar cuota' },
};

type Props = {
  item: AgendaItemDisplay | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmItemModal({ item, onConfirm, onCancel }: Props) {
  const insets    = useSafeAreaInsets();
  const copy      = COPY[item?.filter ?? 'gastos'];
  const isIncome  = item?.filter === 'ingresos';
  const ctaStyle  = isIncome ? styles.ctaIncome : styles.ctaExpense;

  return (
    <MoniSheet visible={item !== null} onClose={onCancel}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>

          <Text style={styles.title}>{copy.title}</Text>

          <View style={styles.amountZone}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              ${item?.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.itemRow}>
            {item && (
              <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                <MaterialIcons name={item.iconName} size={20} color={item.iconColor} />
              </View>
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>
              <Text style={styles.jarLine}>{copy.jarLabel}: {item?.jarName}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel} hitSlop={8}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.cta, ctaStyle]} onPress={onConfirm} hitSlop={8}>
              <Text style={styles.ctaText}>{copy.cta}</Text>
            </Pressable>
          </View>

      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.cardPadding,
    paddingTop: spacing.stackSm,
    gap: spacing.stackMd,
  },
  title:      { ...typography.labelMdBold, color: colors.navyDark, textAlign: 'center' },
  amountZone: { alignItems: 'center', paddingVertical: spacing.stackSm },
  amount:     { ...typography.headlineLg, color: colors.navyDark, textAlign: 'center' },
  itemRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.stackMd },
  iconCircle: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemInfo:   { flex: 1 },
  itemName:   { ...typography.labelMdBold, color: colors.navyDark },
  jarLine:    { ...typography.labelSm, color: colors.slateGray, marginTop: spacing.stackXs },
  actions:    { flexDirection: 'row', gap: spacing.stackMd },
  cancel: {
    flex: 1, borderRadius: radius.button, paddingVertical: spacing.stackMd,
    alignItems: 'center', backgroundColor: colors.surfaceContainerHigh,
  },
  cancelText: { ...typography.labelMd, color: colors.slateGray },
  cta: {
    flex: 1, borderRadius: radius.button, paddingVertical: spacing.stackMd, alignItems: 'center',
  },
  ctaExpense: { backgroundColor: colors.alertOrange },
  ctaIncome:  { backgroundColor: colors.emeraldSuccess },
  ctaText:    { ...typography.labelMd, color: colors.pureWhite },
});
