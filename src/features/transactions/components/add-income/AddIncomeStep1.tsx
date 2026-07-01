/**
 * AddIncomeStep1 — Component
 *
 * @what     Paso 1 Registro Ingreso: display monto hero + campo origen + numpad + botón Continuar.
 * @receives 5 props: amount, concept, onConceptChange, onKey, onSiguiente
 * @processes Continuar deshabilitado si monto es 0.
 * @returns  JSX — AmountDisplay + TextInput + NumpadGrid + botón.
 * @props    5: amount, concept, onConceptChange, onKey, onSiguiente
 */
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, radius, typography } from '@shared/styles';
import { AmountDisplay } from '../quick-add/AmountDisplay';
import { NumpadGrid } from '../quick-add/NumpadGrid';

type Props = {
  amount: string;
  concept: string;
  onConceptChange: (v: string) => void;
  onKey: (key: string) => void;
  onSiguiente: () => void;
};

export function AddIncomeStep1({ amount, concept, onConceptChange, onKey, onSiguiente }: Props) {
  const insets = useSafeAreaInsets();
  const canProceed = parseFloat(amount) > 0;

  return (
    <View style={styles.wrap}>
      <AmountDisplay amount={amount} label="Monto del ingreso" />

      <View style={styles.conceptRow}>
        <TextInput
          style={styles.conceptInput}
          value={concept}
          onChangeText={onConceptChange}
          placeholder="¿De dónde llegó? Ej: Freelance, Bono"
          placeholderTextColor={colors.slateGray}
          returnKeyType="done"
        />
      </View>

      <NumpadGrid onKey={onKey} />

      <View style={[styles.btnWrap, { paddingBottom: insets.bottom + spacing.stackLg + spacing.stackMd }]}>
        <Pressable
          style={[styles.btn, !canProceed && styles.btnDisabled]}
          onPress={onSiguiente}
          disabled={!canProceed}
        >
          <Text style={styles.btnText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:         { flex: 1, gap: spacing.stackMd, paddingTop: spacing.stackSm },

  conceptRow:   {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    marginHorizontal: spacing.marginPage,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
  },
  conceptInput: { flex: 1, ...typography.bodyMd, color: colors.navyDark },

  btnWrap:      { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm },
  btn:          {
    height: spacing.buttonHeight,
    backgroundColor: colors.emeraldSuccess,
    borderRadius: radius.button,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled:  { backgroundColor: colors.surfaceContainerHigh },
  btnText:      { ...typography.labelMd, color: colors.pureWhite },
});
