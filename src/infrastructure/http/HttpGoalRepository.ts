/**
 * HttpGoalRepository — Adapter (HTTP)
 *
 * @what     Implementa IGoalRepository contra `GET /goals`. Reemplaza a `JsonGoalRepository`.
 * @receives workspaceId (ignorado: viaja en el token) · id
 * @processes Traduce el JSON a entidades `Goal`, reviviendo `targetDate`.
 * @returns  Promise<Goal[]> · Promise<Goal | null>
 *
 * `currentAmount` llega calculado: el pozo de cada meta se deriva del libro del lado servidor (C4),
 * igual que el balance de las jarras.
 */
import { Goal } from '@core/entities/Goal';
import type { IGoalRepository } from '@core/ports/IGoalRepository';

import { request } from './httpClient';

/** Forma exacta del JSON de la API. `progressPercent`/`stars` llegan pero la entidad los recalcula. */
export interface GoalDto {
  id: string;
  name: string;
  icon: string;
  workspaceId: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
}

export const toGoal = (dto: GoalDto): Goal =>
  new Goal({
    id: dto.id,
    name: dto.name,
    icon: dto.icon,
    workspaceId: dto.workspaceId,
    targetAmount: dto.targetAmount,
    currentAmount: dto.currentAmount,
    targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
  });

export class HttpGoalRepository implements IGoalRepository {
  async findByWorkspace(_workspaceId: string): Promise<Goal[]> {
    const dtos = await request<GoalDto[]>('/goals');
    return dtos.map(toGoal);
  }

  /** No hay `GET /goals/:id`: se filtra sobre la lista, que es corta. */
  async findById(id: string): Promise<Goal | null> {
    const goals = await this.findByWorkspace('');
    return goals.find((g) => g.id === id) ?? null;
  }

  // Escribir metas va por `IGoalActions` (POST/PATCH/DELETE /goals + /deposit + /withdraw), no por el
  // repo: el id lo pone el servidor y Aportar/Sacrificio son reglas. Quedan por el contrato del port.
  async save(_goal: Goal): Promise<void> {
    throw new Error('Crear meta va por IGoalActions.create (POST /goals), no por el repositorio');
  }

  async update(_goal: Goal): Promise<void> {
    throw new Error('Editar meta va por IGoalActions.update (PATCH /goals/:id), no por el repositorio');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Borrar meta va por IGoalActions.remove (DELETE /goals/:id), no por el repositorio');
  }
}
