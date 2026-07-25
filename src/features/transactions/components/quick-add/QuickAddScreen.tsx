/**
 * QuickAddScreen — Component (Screen)
 *
 * @what     M02 — Orquestador Quick Add: header + Paso 1 (numpad) → Paso 2 (ítems) → Paso 3 (jarra).
 * @receives 4 props: jars, listas, onListPurchased, onWritten
 * @processes Gestiona step via useQuickAdd. Header cambia ícono (X/←) y título según paso. El Paso 2
 *           (Detalle/ítems) es opcional: Continuar u Omitir avanzan igual a la jarra.
 * @returns  JSX — SafeArea + header + QuickAddStep1 / QuickAddStepItems / QuickAddStep2.
 * @props    4: jars, listas, onListPurchased, onWritten
 */
import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, typography, spacing } from '@shared/styles';
import { useQuickAdd } from '../../hooks/useQuickAdd';
import { QuickAddStep1 } from './QuickAddStep1';
import { QuickAddStepItems } from './QuickAddStepItems';
import { QuickAddStep2 } from './QuickAddStep2';
import type { JarOption, PickableList } from '../../types';

const TITLES = { 1: 'Registro de Gasto', 2: 'Detalle (opcional)', 3: '¿De qué jarra sale?' } as const;

function handleClose() { router.navigate('/'); }

type Props = { jars: JarOption[]; listas: PickableList[]; onListPurchased: (listId: string) => void; onWritten?: () => void };

export function QuickAddScreen({ jars, listas, onListPurchased, onWritten }: Props) {
  const insets = useSafeAreaInsets();
  const {
    amount, concept, setConcept,
    items, addItem, removeItem, importList,
    selectedJar, setSelectedJar,
    step,
    handleKey, handleSiguiente, handleGoToJar, handleConfirmar, handleBack,
  } = useQuickAdd(jars, onListPurchased, onWritten);

  const listImport = useMemo(() => ({ listas, onImport: importList }), [listas, importList]);

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
        <QuickAddStepItems
          items={items}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onNext={handleGoToJar}
          listImport={listImport}
        />
      )}
      {step === 3 && (
        <QuickAddStep2
          jars={jars}
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
