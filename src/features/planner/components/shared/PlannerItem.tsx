/**
 * PlannerItem — Component
 *
 * @what     Card compacta de ítem para Mi Mes. Layout row: ícono de la jarra + info + botón acción.
 * @receives 2 props: item, onAction
 * @processes Todos los filtros: nombre → monto (color por filtro) → día. Compacto. El ícono se deriva
 *           de la jarra dueña (antes era un emoji guardado aparte: dos sistemas de ícono conviviendo).
 *           **Vencido** (`isOverdue`): degradado detrás de la card + etiqueta en el meta. El color lo
 *           decide el tipo: gastos/deudas en naranja ("Vencido"), ingresos en verde ("Sin confirmar").
 *           El degradado se pinta con `react-native-svg` (ya en el stack, cf. JarLiquid) dentro de una
 *           capa que lo clipa con el radio de la card. El `<Svg>` lleva `width`/`height` explícitos:
 *           con solo `absoluteFill` no siempre toma la medida y el degradado no cubría la card entera.
 * @returns  JSX — Card row con shadow.
 * @props    2: item, onAction
 */
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import { colors, typography, spacing, radius, shadows, sizes } from '@shared/styles';
import { truncateLabel } from '@shared/utils';
import type { AgendaFilter, AgendaItemDisplay } from '../../types';

const OVERDUE_TINT = 0.28; // opacidad en el borde izquierdo; se desvanece a 0

// Solo se atrasa lo que DEBES. Un ingreso nunca llega marcado como vencido (ver mappers), así que
// aquí no hay caso para él: el naranja significa una sola cosa y por eso significa algo.
const OVERDUE_COLOR = colors.alertOrange;

type Props = {
  item: AgendaItemDisplay;
  onAction: (id: string) => void;
};

const BTN_LABEL: Record<AgendaFilter, string> = {
  gastos:   'Pagar',
  ingresos: '¡Llegó!',
  deudas:   'Pagar',
};

const BTN_LABEL_DONE: Record<AgendaFilter, string> = {
  gastos:   'Pagado ✓',
  ingresos: 'Recibido ✓',
  deudas:   'Pagado ✓',
};

const AMOUNT_STYLE: Record<AgendaFilter, { color: string }> = {
  gastos:   { color: colors.tertiary },
  ingresos: { color: colors.emeraldSuccess },
  deudas:   { color: colors.alertOrange },
};

export function PlannerItem({ item, onAction }: Props) {
  const btnLabel    = item.isPaid ? BTN_LABEL_DONE[item.filter] : BTN_LABEL[item.filter];
  const handlePress = useCallback(() => onAction(item.id), [item.id, onAction]);
  const gradientId  = `overdue-${item.id}`; // único por card: dos <Defs> con el mismo id colisionan

  return (
    <View style={[styles.card, shadows.card, item.isPaid && styles.cardPaid]}>
      {item.isOverdue && (
        <View style={styles.overdueLayer} pointerEvents="none">
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={OVERDUE_COLOR} stopOpacity={OVERDUE_TINT} />
                <Stop offset="1" stopColor={OVERDUE_COLOR} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
          </Svg>
        </View>
      )}
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          <MaterialIcons name={item.iconName} size={18} color={item.iconColor} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, item.isPaid && styles.namePaid]} numberOfLines={1} ellipsizeMode="tail">{truncateLabel(item.name)}</Text>
          <Text style={[styles.amount, AMOUNT_STYLE[item.filter]]}>
            $ {item.amount.toLocaleString('es')}
          </Text>
          <Text style={[styles.meta, item.isOverdue && styles.metaOverdue]}>
            Día {item.day}{item.isOverdue ? ' · Vencido' : ''}
          </Text>
        </View>
        <Pressable style={[styles.btn, item.isPaid && styles.btnDone, item.isOverdue && styles.btnOverdue]} onPress={handlePress} hitSlop={8}>
          <Text style={[styles.btnText, item.isPaid && styles.btnTextDone]}>{btnLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.pureWhite, borderRadius: radius.card, padding: spacing.stackMd },
  // El overflow vive aquí, no en la card: en la card cliparía su propia sombra.
  overdueLayer: { ...StyleSheet.absoluteFillObject, borderRadius: radius.card, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  iconBox: {
    width: sizes.iconSm, height: sizes.iconSm, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { ...typography.labelMdBold, color: colors.navyDark },
  amount: { ...typography.labelMd, marginTop: spacing.stackXs },
  meta: { ...typography.labelSm, color: colors.slateGray },
  metaOverdue: { color: colors.alertOrange },
  btn: {
    backgroundColor: colors.emeraldSuccess, borderRadius: radius.button,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
    alignSelf: 'center',
  },
  btnText:     { ...typography.labelSm, color: colors.pureWhite },
  btnOverdue:  { backgroundColor: colors.alertOrange },
  cardPaid:    { opacity: 0.6 },
  namePaid:    { textDecorationLine: 'line-through' },
  btnDone:     { backgroundColor: colors.surfaceContainerHigh },
  btnTextDone: { color: colors.slateGray },
});
