/**
 * useAddIncome — Hook
 *
 * @what     Estado y lógica del flujo Registro de Ingreso (Paso 1 monto + Paso 2 distribución).
 * @receives jars: JarOption[] — jarras reales del workspace (M03: 3 base + N personalizadas)
 * @processes Maneja monto, concepto, switch de distribución y montos por jarra (en $, no %).
 *           Nada se asigna automáticamente: `distribution` arranca vacía y solo cambia por acción
 *           explícita del usuario (asignar un monto o "Asignar todo" a una jarra). Sin distribuir:
 *           el 100% se deposita en Libre — pero eso se decide en la confirmación, no se escribe
 *           en `distribution`. La lógica de negocio (CreateTransaction) irá en core/use-cases
 *           cuando haya backend.
 * @returns  { amount, concept, setConcept, step, isDistributing, distribution, totalAmount,
 *            remaining, selectedJarId, jarAmountDraft, jarMaxAvailable, carouselPage,
 *            setCarouselPage, handleKey, handleSiguiente, handleToggleDistribute, handleSelectJar,
 *            handleJarNumpadKey, handleJarNumpadConfirm, handleAssignAll, handleJarNumpadCancel,
 *            handleConfirmar, handleBack, resetAll }
 */
import { useState, useCallback, useMemo } from 'react';

import { applyNumpadKey } from '@shared/utils';
import type { JarOption, IncomeDistribution } from '../types';

function emptyDistribution(jars: JarOption[]): IncomeDistribution {
  return Object.fromEntries(jars.map(j => [j.id, 0]));
}

export function useAddIncome(jars: JarOption[]) {
  const [amount,       setAmount]       = useState('0');
  const [concept,      setConcept]      = useState('');
  const [step,         setStep]         = useState<1 | 2>(1);
  const [isDistributing, setIsDistributing] = useState(false);
  const [distribution, setDistribution] = useState<IncomeDistribution>(() => emptyDistribution(jars));
  const [selectedJarId, setSelectedJarId] = useState<string | null>(null);
  const [jarAmountDraft, setJarAmountDraft] = useState('0');
  const [carouselPage, setCarouselPage] = useState(0);

  const totalAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const allocated   = useMemo(
    () => Object.values(distribution).reduce((sum, v) => sum + v, 0),
    [distribution]
  );
  const remaining = useMemo(
    () => Math.round((totalAmount - allocated) * 100) / 100,
    [totalAmount, allocated]
  );
  const jarMaxAvailable = useMemo(() => {
    if (!selectedJarId) return 0;
    const otherSum = Object.entries(distribution).reduce(
      (sum, [id, v]) => id === selectedJarId ? sum : sum + v, 0
    );
    return Math.max(0, Math.round((totalAmount - otherSum) * 100) / 100);
  }, [selectedJarId, distribution, totalAmount]);

  const handleKey = useCallback((key: string) => {
    setAmount(prev => applyNumpadKey(prev, key));
  }, []);

  const handleSiguiente = useCallback(() => {
    if (totalAmount > 0) setStep(2);
  }, [totalAmount]);

  const handleToggleDistribute = useCallback(() => {
    setIsDistributing(prev => !prev);
    setDistribution(emptyDistribution(jars));
  }, [jars]);

  const handleSelectJar = useCallback((jarId: string) => {
    const current = distribution[jarId] ?? 0;
    setJarAmountDraft(current > 0 ? current.toString() : '0');
    setSelectedJarId(jarId);
  }, [distribution]);

  const handleJarNumpadKey = useCallback((key: string) => {
    setJarAmountDraft(prev => applyNumpadKey(prev, key));
  }, []);

  const handleJarNumpadConfirm = useCallback(() => {
    if (!selectedJarId) return;
    const n = Math.min(jarMaxAvailable, Math.max(0, parseFloat(jarAmountDraft) || 0));
    setDistribution(prev => ({ ...prev, [selectedJarId]: Math.round(n * 100) / 100 }));
    setSelectedJarId(null);
  }, [selectedJarId, jarAmountDraft, jarMaxAvailable]);

  const handleAssignAll = useCallback(() => {
    if (!selectedJarId) return;
    setDistribution(prev => ({ ...prev, [selectedJarId]: jarMaxAvailable }));
    setSelectedJarId(null);
  }, [selectedJarId, jarMaxAvailable]);

  const handleJarNumpadCancel = useCallback(() => {
    setSelectedJarId(null);
  }, []);

  const resetAll = useCallback(() => {
    setAmount('0');
    setConcept('');
    setStep(1);
    setIsDistributing(false);
    setDistribution(emptyDistribution(jars));
    setSelectedJarId(null);
    setJarAmountDraft('0');
    setCarouselPage(0);
  }, [jars]);

  const handleConfirmar = useCallback(() => {
    // TODO: core/use-cases/CreateTransaction (isIncome: true)
    // Sin distribuir (isDistributing=false): 100% a Libre, decidido acá — no en `distribution`.
    resetAll();
  }, [resetAll]);

  const handleBack = useCallback(() => setStep(1), []);

  return {
    amount, concept, setConcept,
    step,
    isDistributing, distribution, totalAmount, remaining,
    selectedJarId, jarAmountDraft, jarMaxAvailable, carouselPage, setCarouselPage,
    handleKey, handleSiguiente, handleToggleDistribute,
    handleSelectJar, handleJarNumpadKey, handleJarNumpadConfirm, handleAssignAll, handleJarNumpadCancel,
    handleConfirmar, handleBack, resetAll,
  };
}
