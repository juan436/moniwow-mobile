/**
 * DeleteRecurringSheet — Component
 *
 * @what     Confirmación antes de eliminar un compromiso. El texto cambia según si tiene pagos:
 *           sin pagos se borra, con pagos se cancela.
 * @receives 3 props: item, onCancel, onConfirm
 * @processes Hace VISIBLE lo que la app decide sola (`useRecurrentes.onDelete` mira el libro): si
 *           cancela y borra en silencio, el usuario nunca sabe qué pasó.
 *           **Cuidado con las palabras**: nunca "este pago" — es "este compromiso". El pago vive en
 *           el libro y no se toca nunca; "se eliminará este pago" se lee como que le borran la
 *           plata. Y nunca "basura": es cierto para nosotros, al usuario le suena a reto.
 *           No dice "desde agosto": si lo de este mes aún no venció, deja de pedirse desde ESTE mes
 *           (regla D5 de planes/cancelar-compromisos). "De acá en adelante" es cierto siempre.
 *           El chrome lo pone `MoniSheet`; acá solo vive el texto y los botones.
 * @returns  JSX — sheet con el texto del caso y su botón.
 * @props    3: item, onCancel, onConfirm
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@shared/styles';
import { MoniButton, MoniSheet } from '@shared/components';
import type { RecurringDisplay } from '../../types';

type Props = {
  item: RecurringDisplay | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteRecurringSheet({ item, onCancel, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const pagos = item?.paymentCount ?? 0;
  const hasPayments = pagos > 0;

  return (
    <MoniSheet visible={item !== null} onClose={onCancel}>
      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.stackLg }]}>
        <Text style={styles.title}>
          {hasPayments ? `Cancelar ${item?.name}` : `Eliminar ${item?.name}`}
        </Text>
        <Text style={styles.text}>
          {hasPayments
            ? `Deja de pedirse de acá en adelante. Los ${pagos} pago${pagos === 1 ? '' : 's'} que ya hiciste se conservan.`
            : 'No tiene ningún pago registrado. Se eliminará por completo.'}
        </Text>
        <MoniButton
          label={hasPayments ? 'Cancelar compromiso' : 'Eliminar'}
          onPress={onConfirm}
          variant="danger"
        />
        <Pressable onPress={onCancel} hitSlop={8}>
          <Text style={styles.dismiss}>Volver</Text>
        </Pressable>
      </View>
    </MoniSheet>
  );
}

const styles = StyleSheet.create({
  body:    { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackMd, gap: spacing.stackMd },
  title:   { ...typography.headlineMd, color: colors.navyDark },
  text:    { ...typography.bodyMd, color: colors.slateGray },
  dismiss: { ...typography.labelMd, color: colors.slateGray, textAlign: 'center' },
});
