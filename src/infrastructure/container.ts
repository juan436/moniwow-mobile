/**
 * container — Composition root
 *
 * @what     Punto único donde se instancian los adapters concretos y se exponen como sus PORTS.
 *           Las features/use-cases dependen de estas interfaces, no de la implementación JSON.
 * @processes Hoy inyecta los adapters JSON (BD simulada). Migrar a backend = cambiar SOLO estas
 *           líneas por los adapters HTTP (JsonXRepository → HttpXRepository); nada más se toca.
 * @returns  Instancias singleton tipadas como sus ports.
 */
import { IJarRepository } from '@core/ports/IJarRepository';
import { ITransactionRepository } from '@core/ports/ITransactionRepository';
import { IGoalRepository } from '@core/ports/IGoalRepository';
import { IDebtRepository } from '@core/ports/IDebtRepository';
import { IListRepository } from '@core/ports/IListRepository';
import { IRecurrenceRepository } from '@core/ports/IRecurrenceRepository';
import { IWorkspaceRepository } from '@core/ports/IWorkspaceRepository';

import { JsonJarRepository } from './json/JsonJarRepository';
import { JsonTransactionRepository } from './json/JsonTransactionRepository';
import { JsonGoalRepository } from './json/JsonGoalRepository';
import { JsonDebtRepository } from './json/JsonDebtRepository';
import { JsonListRepository } from './json/JsonListRepository';
import { JsonRecurrenceRepository } from './json/JsonRecurrenceRepository';
import { JsonWorkspaceRepository } from './json/JsonWorkspaceRepository';

// El libro va primero: `jars` deriva su balance de `transactions` (C4), no al revés.
export const transactionRepository: ITransactionRepository = new JsonTransactionRepository();
export const jarRepository: IJarRepository = new JsonJarRepository(transactionRepository);
export const goalRepository: IGoalRepository = new JsonGoalRepository();
export const debtRepository: IDebtRepository = new JsonDebtRepository();
export const listRepository: IListRepository = new JsonListRepository();
export const recurrenceRepository: IRecurrenceRepository = new JsonRecurrenceRepository();
export const workspaceRepository: IWorkspaceRepository = new JsonWorkspaceRepository();
