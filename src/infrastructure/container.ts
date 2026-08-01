/**
 * container — Composition root
 *
 * @what     Punto único donde se instancian los adapters concretos y se exponen como sus PORTS.
 *           Las features/use-cases dependen de estas interfaces, no de una implementación concreta.
 * @processes **F6 cerrada**: los 8 dominios hablan con la API real, el andamiaje JSON (`json/`, `db/`)
 *           se borró — ya no hacía falta ni de repuesto. Cambiar de origen fue cambiar SOLO estas
 *           líneas (`JsonXRepository` → `HttpXRepository`): ni los hooks ni las pantallas se enteraron.
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
import { IDebtActions } from '@core/ports/IDebtActions';
import { IRecurrenceActions } from '@core/ports/IRecurrenceActions';
import { IJarActions } from '@core/ports/IJarActions';
import { IListActions } from '@core/ports/IListActions';
import { ITransactionActions } from '@core/ports/ITransactionActions';
import { IGoalActions } from '@core/ports/IGoalActions';
import { IWorkspaceActions } from '@core/ports/IWorkspaceActions';
import { IFeedbackActions } from '@core/ports/IFeedbackActions';

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
import { HttpListActions } from './http/HttpListActions';
import { HttpTransactionActions } from './http/HttpTransactionActions';
import { HttpGoalActions } from './http/HttpGoalActions';
import { HttpWorkspaceActions } from './http/HttpWorkspaceActions';
import { HttpFeedbackActions } from './http/HttpFeedbackActions';

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
// Repartir un ingreso (M02) y sacar de una meta (M08) también son reglas del servidor: escriben
// varios movimientos con signos y jarras que decide la API, no un `save()` armado en el cliente.
export const goalActions: IGoalActions = new HttpGoalActions();
// Listas: crear/borrar y tocar los ítems (subrecurso) van por acción, no por `repo.save()` — el id de
// la lista y el de cada ítem los pone el servidor. El `listRepository` de arriba queda solo para leer.
export const listActions: IListActions = new HttpListActions();

// Crear el espacio y unirse a uno también son acciones: ambas siembran/cambian estado del lado
// servidor y devuelven un token NUEVO (el viejo lleva `workspaceId: ''` o el de antes congelado
// dentro). No hay `workspaceRepository`: mobile nunca lee un workspace suelto, solo crea o se une.
export const workspaceActions: IWorkspaceActions = new HttpWorkspaceActions();

// Buzón de desarrollo: cualquier usuario autenticado puede mandar un texto. Sin lectura desde la
// app — se extrae aparte, no es una feature de producto.
export const feedbackActions: IFeedbackActions = new HttpFeedbackActions();
