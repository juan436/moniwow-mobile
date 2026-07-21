/**
 * HttpJarRepository — Adapter (HTTP)
 *
 * @what     Implementa IJarRepository contra `GET /jars`. Reemplaza a `JsonJarRepository`.
 * @receives Nada por constructor: el workspace viaja dentro del token.
 * @processes Pide el JSON a la API y lo traduce a entidades `Jar`.
 * @returns  Promise<Jar[]> · Promise<Jar | null>
 *
 * **El `balance` llega calculado pero los hooks lo ignoran**, y está bien así: `useJars`, `useAudit`,
 * `useDashboard` y `useGoals` siguen derivándolo del libro EN VIVO con `ComputeJarBalances`. Por eso
 * al registrar un gasto la jarra baja sola, sin esperar al servidor. La API es la verdad; el cálculo
 * local es la respuesta instantánea, y ambos suman el mismo libro. C4 intacto: nadie lo almacena.
 *
 * (El adapter JSON devolvía `balance: 0`, así que este campo es nuevo — hoy sirve de contraste si
 * alguna vez los dos números discrepan.)
 *
 * **`/jars` no acepta filtro de workspace** y hace bien: el del token es el único que existe. Por eso
 * `findByWorkspace` ignora su argumento — se conserva en la firma porque el port lo pide y los
 * llamadores no se tocan.
 */
import { Jar } from '@core/entities/Jar';
import type { JarType } from '@core/entities/Jar';
import type { IJarRepository } from '@core/ports/IJarRepository';

import { request } from './httpClient';

/** Forma exacta del JSON de la API. Trae derivados (`isNegative`…) que la entidad recalcula sola. */
export interface JarDto {
  id: string;
  name: string;
  balance: number;
  type: string;
  workspaceId: string;
  icon: string;
  isBlindado: boolean;
  targetAmount?: number;
}

export const toJar = (dto: JarDto): Jar =>
  new Jar({
    id: dto.id,
    name: dto.name,
    balance: dto.balance,
    type: dto.type as JarType,
    workspaceId: dto.workspaceId,
    icon: dto.icon,
    isBlindado: dto.isBlindado,
    targetAmount: dto.targetAmount,
  });

export class HttpJarRepository implements IJarRepository {
  async findByWorkspace(_workspaceId: string): Promise<Jar[]> {
    const dtos = await request<JarDto[]>('/jars');
    return dtos.map(toJar);
  }

  /** No hay `GET /jars/:id`: se filtra sobre la lista, que son 4-16 jarras. */
  async findById(id: string): Promise<Jar | null> {
    const jars = await this.findByWorkspace('');
    return jars.find((j) => j.id === id) ?? null;
  }

  // Escribir jarras NO pasa por el repo: crear/editar/borrar tienen reglas (candado de capacidades,
  // id del servidor) y van por `IJarActions` (`POST`/`PATCH`/`DELETE /jars`). Estos quedan por el
  // contrato del port, pero nadie debería llamarlos — si alguien lo hace, que falle a la vista.
  async save(_jar: Jar): Promise<void> {
    throw new Error('Crear jarra va por IJarActions.create (POST /jars), no por el repositorio');
  }

  async update(_jar: Jar): Promise<void> {
    throw new Error('Editar jarra va por IJarActions.update (PATCH /jars/:id), no por el repositorio');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Borrar jarra va por IJarActions.remove (DELETE /jars/:id), no por el repositorio');
  }
}
