/**
 * ConfirmIncomeBanner — Component
 *
 * @what     Recordatorio verde en la pestaña Ingresos: ingresos cuya fecha ya pasó y siguen sin marcar.
 * @receives 2 props: count, total
 * @processes No se pinta si no hay ninguno. **No es un "vencido"**: un ingreso no se debe, no se
 *           atrasa. Es un empujón — "quizá se te olvidó confirmar que llegó". Por eso VERDE, no
 *           naranja: el naranja se reserva para lo que debes; si esto también fuera naranja, el color
 *           dejaría de avisar de nada. Abre su propia página (como el de atrasados) con solo esos
 *           ingresos aislados, para marcarlos sin buscarlos entre los futuros.
 * @returns  JSX — banner verde pulsable, o null.
 * @props    2: count, total
 */
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing, radius } from '@shared/styles';

type Props = {
  count: number;
  total: number;
};

export function ConfirmIncomeBanner({ count, total }: Props) {
  if (count === 0) return null;

  const label = count === 1
    ? '¿Te llegó 1 ingreso?'
    : `¿Te llegaron ${count} ingresos?`;

  return (
    <Pressable style={styles.banner} onPress={() => router.push('/pending-income')}>
      <MaterialIcons name="schedule" size={20} color={colors.emeraldSuccess} />
      <View style={styles.info}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.amount}>$ {total.toLocaleString('es')} sin confirmar</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.emeraldSuccess} />
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
    backgroundColor: colors.emeraldSuccess + '1A',
    borderWidth: 1,
    borderColor: colors.emeraldSuccess + '40',
  },
  info:   { flex: 1 },
  title:  { ...typography.labelMdBold, color: colors.emeraldSuccess },
  amount: { ...typography.labelSm, color: colors.slateGray, marginTop: spacing.stackXs },
});
