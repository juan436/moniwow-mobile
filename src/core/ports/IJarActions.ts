/**
 * IJarActions — Port (acción)
 *
 * @what     Escrituras de jarra server-authoritative: mover dinero (transferir) y el CRUD
 *           (crear/editar/borrar).
 * @receives Según el método.
 * @processes Lo implementa `HttpJarActions` contra `POST /jars/transfer`, `POST /jars`,
 *           `PATCH /jars/:id`, `DELETE /jars/:id`.
 * @returns  Transaction (transfer) · Jar (create/update) · void (remove).
 *
 * **Por qué no `IJarRepository.save/update/delete`:** crear/editar/borrar una jarra tiene REGLAS que
 * viven en el servidor — el candado de capacidades (una jarra base no se renombra ni se borra) y el id
 * (lo pone la API; mobile no genera UUID). Un `save()` que solo escribe la fila dejaría ese candado y
 * ese id en manos del cliente, que es justo lo que se salta con `curl`. `create`/`update` devuelven la
 * jarra ya con su id/balance del servidor para reemplazar la local.
 *
 * **Una sola transacción mueve las dos jarras** en `transfer` (`jarId` origen + `toJarId` destino).
 */
import { Jar } from '../entities/Jar';
import { Transaction } from '../entities/Transaction';

export interface CreateJarInput {
  name: string;
  icon: string;
  isBlindado?: boolean;
  targetAmount?: number;
}

export interface UpdateJarInput {
  name?: string;
  icon?: string;
  isBlindado?: boolean;
  targetAmount?: number;
}

export interface IJarActions {
  transfer(sourceJarId: string, destinationJarId: string, amount: number): Promise<Transaction>;
  create(input: CreateJarInput): Promise<Jar>;
  update(jarId: string, input: UpdateJarInput): Promise<Jar>;
  remove(jarId: string): Promise<void>;
}
