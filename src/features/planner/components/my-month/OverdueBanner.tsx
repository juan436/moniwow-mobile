/**
 * OverdueBanner — Component
 *
 * @what     Aviso de atrasados en Mi Mes, específico del tipo de la pestaña. Abre la página de atrasados.
 * @receives 3 props: kind, count, total
 * @processes **Un gasto atrasado no es una cuota atrasada** (se piden por separado): en la pestaña
 *           Gastos cuenta solo pagos, en Deudas solo cuotas. Antes contaba todo y salía idéntico en
 *           las dos — el mismo aviso en dos sitios que hablan de cosas distintas.
 *           No se pinta si no hay nada. Sin ingresos: no se atrasan (no los debes).
 * @returns  JSX — banner naranja pulsable, o null.
 * @props    3: kind, count, total
 */
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing, radius } from '@shared/styles';

type Kind = 'pagos' | 'cuotas';

type Props = {
  kind: Kind;
  count: number;
  total: number;
};

const NOUN: Record<Kind, { one: string; many: string }> = {
  pagos:  { one: 'pago atrasado',  many: 'pagos atrasados' },
  cuotas: { one: 'deuda atrasada', many: 'deudas atrasadas' },
};

export function OverdueBanner({ kind, count, total }: Props) {
  if (count === 0) return null;

  const noun  = NOUN[kind];
  const label = count === 1 ? `1 ${noun.one}` : `${count} ${noun.many}`;

  return (
    <Pressable style={styles.banner} onPress={() => router.push('/overdue')}>
      <MaterialIcons name="warning-amber" size={20} color={colors.alertOrange} />
      <View style={styles.info}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.amount}>$ {total.toLocaleString('es')} sin pagar</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.alertOrange} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginHorizontal: spacing.marginPage,
    padding: spacing.stackMd,
    borderRadius: radius.card,
    backgroundColor: colors.alertOrange + '1A',
    borderWidth: 1,
    borderColor: colors.alertOrange + '40',
  },
  info:   { flex: 1 },
  title:  { ...typography.labelMdBold, color: colors.alertOrange },
  amount: { ...typography.labelSm, color: colors.slateGray, marginTop: spacing.stackXs },
});
