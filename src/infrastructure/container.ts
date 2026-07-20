/**
 * container — Composition root
 *
 * @what     Punto único donde se instancian los adapters concretos y se exponen como sus PORTS.
 *           Las features/use-cases dependen de estas interfaces, no de la implementación JSON.
 * @processes **F6 casi cerrada**: los 7 dominios de datos hablan con la API real. Solo `workspaces`
 *           sigue en JSON, porque la API no tiene ese controller (ver la nota abajo). Cambiar de
 *           origen fue cambiar SOLO estas líneas (`JsonXRepository` → `HttpXRepository`): ni los
 *           hooks ni las pantallas se enteraron.
 *
 *           **Lectura sí, escritura no**: los adapters HTTP leen, pero `save`/`update`/`delete`
 *           lanzan nombrando el endpoint que falta. Es deliberado — el adapter JSON los aceptaba y
 *           los perdía en memoria, que es peor que un error.
 * @returns  Instancias singleton tipadas como sus ports.
 */
import { IAuthRepository } from '@core/ports/IAuthRepository';
import { IJarRepository } from '@core/ports/IJarRepository';
import { ITransactionRepository } from '@core/ports/ITransactionRepository';
import { IGoalRepository } from '@core/ports/IGoalRepository';
import { IDebtRepository } from '@core/ports/IDebtRepository';
import { IListRepository } from '@core/ports/IListRepository';
import { IRecurrenceRepository } from '@core/ports/IRecurrenceRepository';
import { ISummaryRepository } from '@core/ports/ISummaryRepository';
import { IWorkspaceRepository } from '@core/ports/IWorkspaceRepository';
import { IDebtActions } from '@core/ports/IDebtActions';
import { IRecurrenceActions } from '@core/ports/IRecurrenceActions';
import { IJarActions } from '@core/ports/IJarActions';
import { ITransactionActions } from '@core/ports/ITransactionActions';
import { IWorkspaceActions } from '@core/ports/IWorkspaceActions';

import { JsonWorkspaceRepository } from './json/JsonWorkspaceRepository';
import { HttpAuthRepository } from './http/HttpAuthRepository';
import { HttpJarRepository } from './http/HttpJarRepository';
import { HttpTransactionRepository } from './http/HttpTransactionRepository';
import { HttpGoalRepository } from './http/HttpGoalRepository';
import { HttpDebtRepository } from './http/HttpDebtRepository';
import { HttpListRepository } from './http/HttpListRepository';
import { HttpRecurrenceRepository } from './http/HttpRecurrenceRepository';
import { HttpSummaryRepository } from './http/HttpSummaryRepository';
import { HttpDebtActions } from './http/HttpDebtActions';
import { HttpRecurrenceActions } from './http/HttpRecurrenceActions';
import { HttpJarActions } from './http/HttpJarActions';
import { HttpTransactionActions } from './http/HttpTransactionActions';
import { HttpWorkspaceActions } from './http/HttpWorkspaceActions';

export const transactionRepository: ITransactionRepository = new HttpTransactionRepository();
// El balance YA viene calculado por la API (`FindJarsByWorkspace` suma el libro del lado servidor),
// al revés que el adapter JSON, que devolvía 0. C4 intacto: sigue sin almacenarse, solo cambia quién
// hace la suma. Escribir jarras aún lanza — faltan los endpoints.
export const jarRepository: IJarRepository = new HttpJarRepository();
export const goalRepository: IGoalRepository = new HttpGoalRepository();
export const debtRepository: IDebtRepository = new HttpDebtRepository();
export const listRepository: IListRepository = new HttpListRepository();
export const recurrenceRepository: IRecurrenceRepository = new HttpRecurrenceRepository();

// `GET /summary` trae patrimonio, balances, totales por mes, gasto por jarra y próximos compromisos
// **en una sola lectura del libro**. Sustituye a los cuatro `Compute*` que mobile corría sobre las
// 359 transacciones en cada arranque. No tiene adapter JSON: nació después de que la API mandara.
export const summaryRepository: ISummaryRepository = new HttpSummaryRepository();

// **`workspaces` sigue en JSON y no por olvido: la API no tiene ese controller.** Es el agujero que
// documenta [[planes/moniwow-multitenant]] — `POST /auth/register` deja `workspaceId: ''` y no hay
// endpoint para crear el espacio. Mientras exista este JSON, el registro de un amigo "funciona" y
// entra a un workspace que no existe. Migrarlo es F2 de ese plan, no de F6.
export const workspaceRepository: IWorkspaceRepository = new JsonWorkspaceRepository();

// Auth ya NO es mock: habla con la API. `HttpAuthRepository` añade `me()` y `logout()` sobre el
// port, que `AuthProvider` necesita para restaurar y cerrar sesión.
export const authRepository = new HttpAuthRepository() satisfies IAuthRepository;

// --- Acciones (decisión B, 2026-07-19) ---
// Escribir en el libro NO pasa por `repo.save()`: pagar una cuota o confirmar un recurrente son
// REGLAS, y viven del lado servidor. Si mobile calculara la transacción y la guardara, los endpoints
// que tienen la regla no los llamaría nadie. Por eso estos tres ports existen aparte de los repos.
export const debtActions: IDebtActions = new HttpDebtActions();
export const recurrenceActions: IRecurrenceActions = new HttpRecurrenceActions();
export const jarActions: IJarActions = new HttpJarActions();
export const transactionActions: ITransactionActions = new HttpTransactionActions();

// Crear el espacio también es acción: siembra las 4 jarras base y devuelve un token NUEVO (el viejo
// lleva `workspaceId: ''` dentro). El `workspaceRepository` JSON de arriba sigue ahí solo para las
// lecturas que nadie ha migrado — `POST /workspaces` ya es real.
export const workspaceActions: IWorkspaceActions = new HttpWorkspaceActions();
