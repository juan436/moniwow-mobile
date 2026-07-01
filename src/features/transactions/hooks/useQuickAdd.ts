/**
 * useQuickAdd — Hook
 *
 * @what     Estado y lógica del flujo Quick Add (Paso 1 monto + Paso 2 jarra).
 * @receives jars: JarOption[] — jarras reales del workspace (M03: 3 base + N personalizadas)
 * @processes Maneja string del monto (applyKey), concepto, jarra seleccionada y paso activo.
 *           Default de selectedJar: "libre" si existe, si no la primera jarra del workspace.
 *           La lógica de negocio (CreateTransaction) irá en core/use-cases cuando haya backend.
 * @returns  { amount, concept, setConcept, selectedJar, setSelectedJar, step, handleKey, handleSiguiente, handleConfirmar, handleBack }
 */
import { useState, useCallback } from 'react';

import { applyNumpadKey } from '@shared/utils';
import type { JarOption } from '../types';

function defaultJarId(jars: JarOption[]): string {
  return jars.find(j => j.id === 'libre')?.id ?? jars[0]?.id ?? 'libre';
}

export function useQuickAdd(jars: JarOption[]) {
  const [amount,      setAmount]      = useState('0');
  const [concept,     setConcept]     = useState('');
  const [selectedJar, setSelectedJar] = useState<string>(() => defaultJarId(jars));
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
    setSelectedJar(defaultJarId(jars));
    setStep(1);
  }, [jars]);

  const handleBack = useCallback(() => setStep(1), []);

  return {
    amount, concept, setConcept,
    selectedJar, setSelectedJar,
    step,
    handleKey, handleSiguiente, handleConfirmar, handleBack,
  };
}
