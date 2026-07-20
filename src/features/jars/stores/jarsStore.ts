/**
 * jarsStore — Zustand store
 *
 * @what     Fuente ÚNICA del estado de jarras (dashboard + grid + modales comparten esta lista).
 *           Guarda entidades `Jar` del dominio hidratadas desde `jarRepository` — ya NO una lista
 *           hardcodeada. Antes convivían dos listas (INITIAL_JARS del store vs db/jars.json): la UI
 *           pintaba una y los repos leían la otra. Ahora hay una sola (P7).
 * @processes `load` hidrata una vez (idempotente aunque varias pantallas lo pidan a la vez). Las
 *           mutaciones escriben al repositorio Y al estado. NO reimplementa reglas de negocio:
 *           importa `jarCapabilities` (core) como candado — `remove` rechaza jarras protegidas y
 *           `save` ignora campos que la jarra no permite editar. La UI ya deshabilita esos controles;
 *           este candado es la segunda capa (varias entradas, UI falible, futuro backend).
 * @returns  useJarsStore hook (selectores) — envuelto por useJars, que mapea Jar → JarDisplay.
 */
import { create } from 'zustand';

import { Jar, jarCapabilities } from '@core/entities/Jar';
import { jarRepository, jarActions } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import type { CreateJarData, SaveJarData } from '../types';

// Solo para LEER: el repo aún pide el workspace por firma aunque el servidor lo saque del token.
const WORKSPACE_ID = 'ws1';

function buildCustomJar(data: CreateJarData): Jar {
  return new Jar({
    id: `custom-${Date.now()}`,
    name: data.name,
    balance: 0,
    type: 'custom',
    workspaceId: WORKSPACE_ID,
    icon: data.iconName,
    isBlindado: data.isBlindado ?? false,
    targetAmount: data.targetAmount,
  });
}

/** Candado de dominio: solo escribe los campos que las capacidades de la jarra permiten. */
function applySave(jar: Jar, data: SaveJarData): Jar {
  const caps = jarCapabilities(jar.type);
  return new Jar({
    id: jar.id,
    name: caps.canRename ? data.name : jar.name,
    balance: jar.balance,
    type: jar.type,
    workspaceId: jar.workspaceId,
    icon: data.iconName,
    isBlindado: caps.canToggleBlindado ? (data.isBlindado ?? false) : jar.isBlindado,
    targetAmount: caps.canEditBudget ? data.targetAmount : jar.targetAmount,
  });
}

type JarsState = {
  jars: Jar[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  create: (data: CreateJarData) => void;
  save: (data: SaveJarData) => void;
  remove: (id: string) => void;
  transfer: (fromId: string, toId: string, amount: number) => void;
};

// Hidratación en vuelo: varias pantallas montan a la vez y todas piden load().
let hydrating: Promise<void> | null = null;

export const useJarsStore = create<JarsState>((set, get) => ({
  jars: [],
  isLoading: true,
  error: null,

  load: () => {
    if (hydrating) return hydrating;
    hydrating = jarRepository
      .findByWorkspace(WORKSPACE_ID)
      .then((jars) => set({ jars, isLoading: false }))
      .catch(() => set({ error: 'No se pudieron cargar las jarras', isLoading: false }));
    return hydrating;
  },

  create: (data) => {
    const jar = buildCustomJar(data);
    void jarRepository.save(jar);
    set((s) => ({ jars: [...s.jars, jar] }));
  },

  save: (data) => {
    const target = get().jars.find((j) => j.id === data.id);
    if (!target) return;
    const updated = applySave(target, data);
    void jarRepository.update(updated);
    set((s) => ({ jars: s.jars.map((j) => (j.id === updated.id ? updated : j)) }));
  },

  remove: (id) => {
    const jar = get().jars.find((j) => j.id === id);
    if (!jar || !jarCapabilities(jar.type).canDelete) return; // jarra protegida → no-op
    void jarRepository.delete(id);
    set((s) => ({ jars: s.jars.filter((j) => j.id !== id) }));
  },

  // Una transferencia es UN movimiento del libro, no dos balances tecleados: el balance se deriva
  // (C4), así que escribir la jarra aquí no haría nada. Publicarla al libro sí mueve las dos jarras.
  // La escribe la API (`jarActions`) y el movimiento que devuelve entra al libro local, que es de
  // donde los hooks derivan el saldo — por eso las dos jarras se mueven al instante sin recargar.
  transfer: (fromId, toId, amount) => {
    void jarActions
      .transfer(fromId, toId, amount)
      .then((transaction) => useTransactionsStore.getState().add(transaction));
  },
}));
