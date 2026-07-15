/**
 * useQuickAdd — Hook
 *
 * @what     Estado y lógica del flujo Quick Add (Paso 1 monto → Paso 2 ítems → Paso 3 jarra).
 * @receives jars: JarOption[] — jarras reales del workspace (M03: 4 base + N personalizadas).
 *           onListPurchased?: (listId) => void — se llama al confirmar si la compra se armó desde una
 *           lista, para chulear sus ítems (lo inyecta el composition root con listsStore.markPurchased).
 * @processes Maneja string del monto (applyKey), concepto, ítems en borrador (solo nombre), jarra
 *           seleccionada y paso activo. El paso Detalle (ítems) es opcional: se avanza con Continuar
 *           u Omitir por igual. Default de selectedJar: "libre" si existe, si no la primera jarra.
 *           **Confirmar PERSISTE**: delega en `CreateTransaction` (core) y publica la transacción al
 *           `transactionsStore`. Antes era un TODO y el gasto se evaporaba: el libro nunca se llenaba
 *           y todo lo que se deriva de él (balances, patrimonio, Revisión) se quedaba en mock.
 *           El balance de la jarra NO se toca — se deriva del libro (C4).
 * @returns  { amount, concept, setConcept, items, addItem, removeItem, importList, selectedJar,
 *            setSelectedJar, step, error, handleKey, handleSiguiente, handleGoToJar, handleConfirmar,
 *            handleBack }
 */
import { useState, useCallback, useRef } from 'react';

import { CreateTransaction } from '@core/use-cases/CreateTransaction';
import { jarRepository, transactionRepository } from '@infrastructure/container';
import { applyNumpadKey } from '@shared/utils';
import { useTransactionsStore } from '../stores/transactionsStore';
import type { JarOption, DraftPurchaseItem, PickableList } from '../types';

type Step = 1 | 2 | 3;

const WORKSPACE_ID = 'ws1'; // mock-stage: único workspace sembrado
const USER_ID = 'u1';

const createTransaction = new CreateTransaction(jarRepository, transactionRepository);

function defaultJarId(jars: JarOption[]): string {
  return jars.find(j => j.id === 'libre')?.id ?? jars[0]?.id ?? 'libre';
}

export function useQuickAdd(jars: JarOption[], onListPurchased?: (listId: string) => void) {
  const [amount,      setAmount]      = useState('0');
  const [concept,     setConcept]     = useState('');
  const [items,       setItems]       = useState<DraftPurchaseItem[]>([]);
  const [importedListId, setImportedListId] = useState<string | null>(null);
  const [selectedJar, setSelectedJar] = useState<string>(() => defaultJarId(jars));
  const [step,        setStep]        = useState<Step>(1);
  const [error,       setError]       = useState<string | null>(null);
  const nextId = useRef(0);

  const addToLedger = useTransactionsStore((s) => s.add);

  const handleKey = useCallback((key: string) => {
    setAmount(prev => applyNumpadKey(prev, key));
  }, []);

  const addItem = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems(prev => [...prev, { id: `it-${nextId.current++}`, name: trimmed }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const importList = useCallback((list: PickableList) => {
    setItems(prev => [...prev, ...list.itemNames.map(name => ({ id: `it-${nextId.current++}`, name }))]);
    setConcept(prev => prev.trim() ? prev : list.name);
    setImportedListId(list.id);
  }, []);

  const handleSiguiente = useCallback(() => {
    if (parseFloat(amount) > 0) setStep(2);
  }, [amount]);

  const handleGoToJar = useCallback(() => setStep(3), []);

  const resetForm = useCallback(() => {
    setAmount('0');
    setConcept('');
    setItems([]);
    setImportedListId(null);
    setSelectedJar(defaultJarId(jars));
    setStep(1);
  }, [jars]);

  const handleConfirmar = useCallback(async () => {
    try {
      setError(null);
      // Los ítems van sin precio: el usuario teclea QUÉ compró, no a cuánto (el precio llega con M09).
      const { transaction } = await createTransaction.execute({
        id: `tx-${Date.now()}`,
        amount: parseFloat(amount),
        description: concept.trim() || 'Gasto',
        type: 'gasto',
        jarId: selectedJar,
        workspaceId: WORKSPACE_ID,
        userId: USER_ID,
        items: items.length > 0 ? items.map((i) => ({ id: i.id, name: i.name })) : undefined,
      });

      await addToLedger(transaction);
      if (importedListId) onListPurchased?.(importedListId);
      resetForm();
    } catch {
      setError('No se pudo registrar el gasto — intenta de nuevo');
    }
  }, [amount, concept, items, selectedJar, importedListId, onListPurchased, addToLedger, resetForm]);

  const handleBack = useCallback(() => {
    setStep(prev => (prev > 1 ? (prev - 1) as Step : 1));
  }, []);

  return {
    amount, concept, setConcept,
    items, addItem, removeItem, importList,
    selectedJar, setSelectedJar,
    step, error,
    handleKey, handleSiguiente, handleGoToJar, handleConfirmar, handleBack,
  };
}
