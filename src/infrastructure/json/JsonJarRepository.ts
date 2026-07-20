/**
 * JsonJarRepository — Adapter (mock)
 *
 * @what     Implementa IJarRepository leyendo la BD simulada `db/jars.json`. Estado en memoria
 *           (mock-stage): siembra desde el JSON y muta el array local. Migrar a backend = otro
 *           adapter del mismo port, sin tocar features.
 * @processes Solo traduce fila ↔ entidad. **El `balance` sale SIEMPRE en 0**: no está en el JSON
 *           porque se DERIVA del libro (C4), y componer dos fuentes es trabajo de un use-case, no
 *           de un adapter. Quien necesite el saldo real usa `FindJarsByWorkspace`.
 *           *Antes esto se derivaba acá (`hydrate`); se movió el 2026-07-19 para que mobile y
 *           `dev/api` sigan la misma regla.*
 */
import { Jar, JarProps } from '@core/entities/Jar';
import { IJarRepository } from '@core/ports/IJarRepository';
import seed from '../db/jars.json';

type JarRow = Omit<JarProps, 'balance'>;

/** Fila → entidad. `balance: 0` porque la BD no lo guarda; lo pone `FindJarsByWorkspace`. */
const toJar = (row: JarRow): Jar => new Jar({ ...row, balance: 0 });

export class JsonJarRepository implements IJarRepository {
  private rows: JarRow[] = seed as unknown as JarRow[];

  async findById(id: string): Promise<Jar | null> {
    const row = this.rows.find((j) => j.id === id);
    return row ? toJar(row) : null;
  }

  async findByWorkspace(workspaceId: string): Promise<Jar[]> {
    return this.rows.filter((j) => j.workspaceId === workspaceId).map(toJar);
  }

  async save(jar: Jar): Promise<void> {
    this.rows = [...this.rows, toRow(jar)];
  }

  async update(jar: Jar): Promise<void> {
    this.rows = this.rows.map((j) => (j.id === jar.id ? toRow(jar) : j));
  }

  async delete(id: string): Promise<void> {
    this.rows = this.rows.filter((j) => j.id !== id);
  }
}

/** El balance no se persiste: se recalcula al leer. Escribirlo sería reintroducir C4. */
function toRow(jar: Jar): JarRow {
  return {
    id: jar.id,
    name: jar.name,
    type: jar.type,
    workspaceId: jar.workspaceId,
    icon: jar.icon,
    isBlindado: jar.isBlindado,
    targetAmount: jar.targetAmount,
  };
}
