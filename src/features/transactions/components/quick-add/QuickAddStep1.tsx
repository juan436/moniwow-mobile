/**
 * QuickAddStep1 — Component
 *
 * @what     Paso 1 Quick Add: display monto hero + campo concepto + numpad + botón Continuar.
 * @receives 5 props: amount, concept, onConceptChange, onKey, onSiguiente
 * @processes Continuar deshabilitado si monto es 0. Campo concepto con ícono IA Scanner (noop).
 * @returns  JSX — AmountDisplay + TextInput + NumpadGrid + botón Continuar.
 * @props    5: amount, concept, onConceptChange, onKey, onSiguiente
 */
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '@shared/styles';
import { AmountDisplay } from './AmountDisplay';
import { NumpadGrid } from './NumpadGrid';

type Props = {
  amount: string;
  concept: string;
  onConceptChange: (v: string) => void;
  onKey: (key: string) => void;
  onSiguiente: () => void;
};

export function QuickAddStep1({ amount, concept, onConceptChange, onKey, onSiguiente }: Props) {
  const insets = useSafeAreaInsets();
  const canProceed = parseFloat(amount) > 0;

  return (
    <View style={styles.wrap}>
      <AmountDisplay amount={amount} />

      <View style={styles.conceptRow}>
        <TextInput
          style={styles.conceptInput}
          value={concept}
          onChangeText={onConceptChange}
          placeholder="¿Qué compraste?"
          placeholderTextColor={colors.slateGray}
          returnKeyType="done"
        />
        <Pressable style={styles.cameraBtn} hitSlop={8}>
          <MaterialIcons name="photo-camera" size={22} color={colors.slateGray} />
        </Pressable>
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
  wrap:         { flex: 1, gap: spacing.stackMd },

  conceptRow:   {
    flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm,
    marginHorizontal: spacing.marginPage,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackSm,
  },
  conceptInput: { flex: 1, ...typography.bodyMd, color: colors.navyDark },
  cameraBtn:    { padding: spacing.stackXs },

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
