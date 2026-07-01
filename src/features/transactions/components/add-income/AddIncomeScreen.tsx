/**
 * AddIncomeScreen — Component (Screen)
 *
 * @what     M02 — Orquestador Registro de Ingreso: header propio + Paso 1 (numpad) o Paso 2 (distribución).
 * @receives 1 prop: jars
 * @processes Gestiona step vía useAddIncome. Header cambia ícono (X/←) y título según paso.
 *           Página normal (ruta expo-router), no Modal — mismo patrón que QuickAddScreen.
 *           state/actions de Step2 van memoizados (useMemo/useCallback) — objetos inline como
 *           prop JSX causan re-render en cada render del padre (code_rules §2).
 * @returns  JSX — SafeArea + header + AddIncomeStep1 o AddIncomeStep2.
 * @props    1: jars
 */
import { useMemo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing } from '@shared/styles';
import { useAddIncome } from '../../hooks/useAddIncome';
import { AddIncomeStep1 } from './AddIncomeStep1';
import { AddIncomeStep2 } from './AddIncomeStep2';
import type { JarOption } from '../../types';

const TITLES = { 1: 'Registro de Ingreso', 2: '¿Distribuir fondos?' } as const;

function handleClose() { router.back(); }

type Props = { jars: JarOption[] };

export function AddIncomeScreen({ jars }: Props) {
  const insets = useSafeAreaInsets();
  const {
    amount, concept, setConcept,
    step,
    isDistributing, distribution, totalAmount, remaining,
    selectedJarId, jarAmountDraft, carouselPage, setCarouselPage,
    handleKey, handleSiguiente, handleToggleDistribute,
    handleSelectJar, handleJarNumpadKey, handleJarNumpadConfirm, handleJarNumpadCancel,
    handleConfirmar, handleBack,
  } = useAddIncome(jars);

  const handleConfirmarYVolver = useCallback(() => {
    handleConfirmar();
    router.back();
  }, [handleConfirmar]);

  const step2State = useMemo(
    () => ({ isDistributing, distribution, totalAmount, remaining, jars, selectedJarId, jarAmountDraft, carouselPage }),
    [isDistributing, distribution, totalAmount, remaining, jars, selectedJarId, jarAmountDraft, carouselPage]
  );

  const step2Actions = useMemo(
    () => ({
      onToggleDistribute: handleToggleDistribute,
      onSelectJar: handleSelectJar,
      onJarNumpadKey: handleJarNumpadKey,
      onJarNumpadConfirm: handleJarNumpadConfirm,
      onJarNumpadCancel: handleJarNumpadCancel,
      onConfirmar: handleConfirmarYVolver,
      onCarouselPageChange: setCarouselPage,
    }),
    [
      handleToggleDistribute, handleSelectJar, handleJarNumpadKey, handleJarNumpadConfirm,
      handleJarNumpadCancel, handleConfirmarYVolver, setCarouselPage,
    ]
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerBtn}
          hitSlop={12}
          onPress={step === 1 ? handleClose : handleBack}
        >
          <MaterialIcons
            name={step === 1 ? 'close' : 'arrow-back'}
            size={24}
            color={colors.navyDark}
          />
        </Pressable>
        <Text style={styles.headerTitle}>{TITLES[step]}</Text>
        <View style={styles.headerBtn} />
      </View>

      {step === 1 && (
        <AddIncomeStep1
          amount={amount}
          concept={concept}
          onConceptChange={setConcept}
          onKey={handleKey}
          onSiguiente={handleSiguiente}
        />
      )}
      {step === 2 && (
        <AddIncomeStep2 state={step2State} actions={step2Actions} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.background },

  header:      {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.stackMd, paddingVertical: spacing.stackMd,
    backgroundColor: colors.pureWhite,
    borderBottomWidth: 1, borderBottomColor: colors.dividerSoft,
  },
  headerBtn:   { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.bodyMd, color: colors.navyDark },
});
