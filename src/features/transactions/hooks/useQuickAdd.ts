/**
 * useQuickAdd — Hook
 *
 * @what     Estado y lógica del flujo Quick Add (Paso 1 monto + Paso 2 jarra).
 * @receives —
 * @processes Maneja string del monto (applyKey), concepto, jarra seleccionada y paso activo.
 *           La lógica de negocio (CreateTransaction) irá en core/use-cases cuando haya backend.
 * @returns  { amount, concept, setConcept, selectedJar, setSelectedJar, step, handleKey, handleSiguiente, handleConfirmar, handleBack }
 */
import { useState, useCallback } from 'react';

import { applyNumpadKey } from '@shared/utils';
import type { JarId } from '../types';

export function useQuickAdd() {
  const [amount,      setAmount]      = useState('0');
  const [concept,     setConcept]     = useState('');
  const [selectedJar, setSelectedJar] = useState<JarId>('libre');
  const [step,        setStep]        = useState<1 | 2>(1);

  const handleKey = useCallback((key: string) => {
    setAmount(prev => applyNumpadKey(prev, key));
  }, []);

  const handleSiguiente = useCallback(() => {
    if (parseFloat(amount) > 0) setStep(2);
  }, [amount]);

  const handleConfirmar = useCallback(() => {
    // TODO: core/use-cases/CreateTransaction
    setAmount('0');
    setConcept('');
    setSelectedJar('libre');
    setStep(1);
  }, []);

  const handleBack = useCallback(() => setStep(1), []);

  return {
    amount, concept, setConcept,
    selectedJar, setSelectedJar,
    step,
    handleKey, handleSiguiente, handleConfirmar, handleBack,
  };
}
