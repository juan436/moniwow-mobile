/**
 * useQuickAdd — Hook
 *
 * @what     Estado y lógica del flujo Quick Add (Paso 1 monto → Paso 2 ítems → Paso 3 jarra).
 * @receives jars: JarOption[] — jarras reales del workspace (M03: 3 base + N personalizadas).
 *           onListPurchased?: (listId) => void — se llama al confirmar si la compra se armó desde una
 *           lista, para chulear sus ítems (lo inyecta el composition root con listsStore.markPurchased).
 * @processes Maneja string del monto (applyKey), concepto, ítems en borrador (solo nombre), jarra
 *           seleccionada y paso activo. El paso Detalle (ítems) es opcional: se avanza con Continuar
 *           u Omitir por igual. Default de selectedJar: "libre" si existe, si no la primera jarra.
 *           La lógica de negocio (CreateTransaction) irá en core/use-cases cuando haya backend —
 *           ahí se mapearán los DraftPurchaseItem a los ítems persistidos.
 *           `importList` vuelca los ítems de una lista planificada (PickableList) al borrador y
 *           autocompleta el concepto con el nombre de la lista si estaba vacío — la lista original
 *           no se toca (llega ya mapeada desde el composition root, planner no se importa acá).
 * @returns  { amount, concept, setConcept, items, addItem, removeItem, importList, selectedJar,
 *            setSelectedJar, step, handleKey, handleSiguiente, handleGoToJar, handleConfirmar, handleBack }
 */
import { useState, useCallback, useRef } from 'react';

import { applyNumpadKey } from '@shared/utils';
import type { JarOption, DraftPurchaseItem, PickableList } from '../types';

type Step = 1 | 2 | 3;

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
  const nextId = useRef(0);

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

  const handleConfirmar = useCallback(() => {
    // TODO: core/use-cases/CreateTransaction (mapea items al modelo persistido)
    if (importedListId) onListPurchased?.(importedListId);
    setAmount('0');
    setConcept('');
    setItems([]);
    setImportedListId(null);
    setSelectedJar(defaultJarId(jars));
    setStep(1);
  }, [jars, importedListId, onListPurchased]);

  const handleBack = useCallback(() => {
    setStep(prev => (prev > 1 ? (prev - 1) as Step : 1));
  }, []);

  return {
    amount, concept, setConcept,
    items, addItem, removeItem, importList,
    selectedJar, setSelectedJar,
    step,
    handleKey, handleSiguiente, handleGoToJar, handleConfirmar, handleBack,
  };
}
