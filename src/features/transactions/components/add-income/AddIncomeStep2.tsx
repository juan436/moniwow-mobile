/**
 * AddIncomeStep2 — Component
 *
 * @what     Paso 2 Registro Ingreso: switch distribuir + barra + carrusel de jarras + CONFIRMAR.
 * @receives 2 props: state, actions (agrupados — superaban el límite de 5 props individuales)
 * @processes Sin distribuir: nota informativa 100% Libre. Distribuyendo: barra proporcional +
 *           carrusel de jarras (páginas de 6, solo tocables). Tocar una jarra abre
 *           AllocationJarNumpad (numpad propio, no teclado nativo). `carouselPage` vive en el
 *           hook (no local al carrusel) para que la página no se pierda al ir y volver del numpad.
 * @returns  JSX — switch row + (nota | barra+carrusel) + botón CONFIRMAR, o AllocationJarNumpad.
 * @props    2: state, actions
 */
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '@shared/styles';
import { AllocationBar } from './AllocationBar';
import { AllocationJarCarousel } from './AllocationJarCarousel';
import { AllocationJarNumpad } from './AllocationJarNumpad';
import type { JarOption, IncomeDistribution } from '../../types';

type State = {
  isDistributing: boolean; distribution: IncomeDistribution; totalAmount: number; remaining: number;
  jars: JarOption[]; selectedJarId: string | null; jarAmountDraft: string; carouselPage: number;
};
type Actions = {
  onToggleDistribute: () => void;
  onSelectJar: (jarId: string) => void;
  onJarNumpadKey: (key: string) => void;
  onJarNumpadConfirm: () => void;
  onJarNumpadCancel: () => void;
  onConfirmar: () => void;
  onCarouselPageChange: (page: number) => void;
};
type Props = { state: State; actions: Actions };

export function AddIncomeStep2({ state, actions }: Props) {
  const insets = useSafeAreaInsets();
  const { isDistributing, distribution, totalAmount, remaining, jars, selectedJarId, jarAmountDraft, carouselPage } = state;
  const {
    onToggleDistribute, onSelectJar, onJarNumpadKey, onJarNumpadConfirm, onJarNumpadCancel,
    onConfirmar, onCarouselPageChange,
  } = actions;
  const canConfirm = !isDistributing || remaining === 0;
  const selectedJar = jars.find((j) => j.id === selectedJarId) ?? null;

  if (selectedJar) {
    return (
      <AllocationJarNumpad
        jar={selectedJar}
        amount={jarAmountDraft}
        onKey={onJarNumpadKey}
        onConfirm={onJarNumpadConfirm}
        onCancel={onJarNumpadCancel}
      />
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>¿Distribuir este ingreso ahora?</Text>
        <Switch
          value={isDistributing}
          onValueChange={onToggleDistribute}
          trackColor={{ false: colors.surfaceContainerHigh, true: colors.emeraldSuccess }}
          thumbColor={colors.pureWhite}
        />
      </View>

      {!isDistributing && (
        <Text style={styles.note}>100% se deposita en Libre 🍃</Text>
      )}

      {isDistributing && (
        <View style={styles.distributeZone}>
          <View style={styles.summaryRow}>
            <AllocationBar jars={jars} distribution={distribution} total={totalAmount} />
            <Text style={[styles.remaining, remaining === 0 ? styles.remainingOk : styles.remainingPending]}>
              {remaining === 0 ? 'Todo asignado ✓' : `Restante: $ ${remaining.toFixed(2)}`}
            </Text>
          </View>

          <AllocationJarCarousel
            jars={jars}
            distribution={distribution}
            onSelectJar={onSelectJar}
            activePage={carouselPage}
            onPageChange={onCarouselPageChange}
          />
        </View>
      )}

      <View style={[styles.btnWrap, { paddingBottom: insets.bottom + spacing.stackLg + spacing.stackMd }]}>
        <Pressable style={[styles.btn, !canConfirm && styles.btnDisabled]} onPress={onConfirmar} disabled={!canConfirm}>
          <Text style={styles.btnText}>Confirmar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:        { gap: spacing.stackMd, paddingTop: spacing.stackSm },

  switchRow:   {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: spacing.marginPage,
    backgroundColor: colors.pureWhite,
    borderRadius: radius.card,
    padding: spacing.stackMd,
  },
  switchLabel: { ...typography.bodyMd, color: colors.navyDark, flex: 1, marginRight: spacing.stackMd },

  note:        { ...typography.labelMd, color: colors.slateGray, textAlign: 'center', paddingHorizontal: spacing.marginPage },

  distributeZone: { gap: spacing.stackMd },
  summaryRow:  { paddingHorizontal: spacing.marginPage, gap: spacing.stackSm },
  remaining:   { ...typography.labelMd, textAlign: 'center' },
  remainingOk: { color: colors.emeraldSuccess },
  remainingPending: { color: colors.alertOrange },

  btnWrap:     { paddingHorizontal: spacing.marginPage, paddingTop: spacing.stackSm },
  btn:         { height: spacing.buttonHeight, backgroundColor: colors.emeraldSuccess, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: colors.surfaceContainerHigh },
  btnText:     { ...typography.labelMd, color: colors.pureWhite },
});
