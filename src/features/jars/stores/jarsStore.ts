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
 *           **`reset` (FB-019):** `hydrating` es module-level — una vez resuelto queda TRUE para
 *           siempre (una Promise resuelta sigue siendo verdadera), así que `load()` solo pega a la
 *           red la primera vez en la vida del proceso JS. Cambiar de cuenta/workspace sin matar la
 *           app (cerrar sesión, crear o unirse a un hogar) dejaba las jarras de la cuenta ANTERIOR
 *           pegadas en pantalla — el token cambiaba, el store no se enteraba. `reset()` limpia el
 *           array y pone `hydrating = null` para que el próximo `load()` vuelva a preguntar.
 * @returns  useJarsStore hook (selectores) — envuelto por useJars, que mapea Jar → JarDisplay.
 */
import { create } from 'zustand';

import { Jar, jarCapabilities } from '@core/entities/Jar';
import { jarRepository, jarActions } from '@infrastructure/container';
import { useTransactionsStore } from '@features/transactions/stores/transactionsStore';
import type { CreateJarData, SaveJarData } from '../types';

// Solo para LEER: el repo aún pide el workspace por firma aunque el servidor lo saque del token.
const WORKSPACE_ID = 'ws1';

type JarsState = {
  jars: Jar[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  /** Vuelve a preguntarle al servidor, ignorando la hidratación ya hecha. */
  reload: () => Promise<void>;
  /** Vacía el store y desarma el candado de hidratación — llamar al cambiar de cuenta/workspace. */
  reset: () => void;
  create: (data: CreateJarData) => void;
  save: (data: SaveJarData) => void;
  remove: (id: string) => void;
  transfer: (fromId: string, toId: string, amount: number) => void;
};

// Hidratación en vuelo: varias pantallas montan a la vez y todas piden load().
let hydrating: Promise<void> | null = null;

type SetState = (partial: Partial<JarsState>) => void;

function fetchJars(set: SetState): Promise<void> {
  return jarRepository
    .findByWorkspace(WORKSPACE_ID)
    .then((jars) => set({ jars, isLoading: false, error: null }))
    .catch(() => set({ error: 'No se pudieron cargar las jarras', isLoading: false }));
}

export const useJarsStore = create<JarsState>((set, get) => ({
  jars: [],
  isLoading: true,
  error: null,

  load: () => {
    if (hydrating) return hydrating;
    hydrating = fetchJars(set);
    return hydrating;
  },

  // El balance ya no se deriva del libro en memoria: lo suma el servidor. Por eso quien escribe
  // (Quick Add, transferir, confirmar un compromiso) tiene que volver a preguntar — antes el número
  // se movía solo porque lo calculaba el propio teléfono.
  reload: () => {
    hydrating = fetchJars(set);
    return hydrating;
  },

  reset: () => {
    hydrating = null;
    set({ jars: [], isLoading: true, error: null });
  },

  // El id, el tipo y el candado de capacidades los pone el SERVIDOR (`POST /jars`). Antes se armaba
  // la jarra local con `custom-${Date.now()}` y se escribía a ciegas; ahora se muestra la que la API
  // devuelve, ya con su id real.
  create: (data) => {
    void jarActions
      .create({ name: data.name, icon: data.iconName, isBlindado: data.isBlindado, targetAmount: data.targetAmount })
      .then((jar) => set((s) => ({ jars: [...s.jars, jar] })));
  },

  // Se mandan todos los campos editables; el candado (qué se puede cambiar por tipo) lo aplica el
  // servidor y devuelve la jarra ya con su balance real. Reemplazamos la fila con esa.
  save: (data) => {
    void jarActions
      .update(data.id, { name: data.name, icon: data.iconName, isBlindado: data.isBlindado, targetAmount: data.targetAmount })
      .then((jar) => set((s) => ({ jars: s.jars.map((j) => (j.id === jar.id ? jar : j)) })));
  },

  remove: (id) => {
    const jar = get().jars.find((j) => j.id === id);
    if (!jar || !jarCapabilities(jar.type).canDelete) return; // guard de UI; el servidor también lo aplica (409)
    void jarActions.remove(id).then(() => set((s) => ({ jars: s.jars.filter((j) => j.id !== id) })));
  },

  // Una transferencia es UN movimiento del libro, no dos balances tecleados: el balance se deriva
  // (C4), así que escribir la jarra aquí no haría nada. La escribe la API (`jarActions`); el
  // movimiento que devuelve entra al libro local para que Movimientos lo muestre ya, y las jarras se
  // releen porque **el balance lo suma el servidor**: sin este `reload` las dos jarras se quedarían
  // con el número viejo hasta remontar la pantalla.
  transfer: (fromId, toId, amount) => {
    void jarActions
      .transfer(fromId, toId, amount)
      .then((transaction) => {
        useTransactionsStore.getState().add(transaction);
        return get().reload();
      });
  },
}));
