/**
 * QuickAddScreen — Component (Screen)
 *
 * @what     M02 — Orquestador Quick Add: header compartido + Paso 1 (numpad) o Paso 2 (jarra).
 * @receives —
 * @processes Gestiona step via useQuickAdd. Header cambia ícono (X/←) y título según paso.
 * @returns  JSX — SafeArea + header + QuickAddStep1 o QuickAddStep2.
 * @props    —
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing } from '@shared/styles';
import { useQuickAdd } from '../../hooks/useQuickAdd';
import { QuickAddStep1 } from './QuickAddStep1';
import { QuickAddStep2 } from './QuickAddStep2';

const TITLES = { 1: 'Registro de Gasto', 2: '¿De qué jarra sale?' } as const;

function handleClose() { router.navigate('/'); }

export function QuickAddScreen() {
  const insets = useSafeAreaInsets();
  const {
    amount, concept, setConcept,
    selectedJar, setSelectedJar,
    step,
    handleKey, handleSiguiente, handleConfirmar, handleBack,
  } = useQuickAdd();

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
        <QuickAddStep1
          amount={amount}
          concept={concept}
          onConceptChange={setConcept}
          onKey={handleKey}
          onSiguiente={handleSiguiente}
        />
      )}
      {step === 2 && (
        <QuickAddStep2
          selectedJar={selectedJar}
          onJarSelect={setSelectedJar}
          onConfirmar={handleConfirmar}
        />
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
