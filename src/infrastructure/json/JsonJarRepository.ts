/**
 * JsonJarRepository — Adapter (mock)
 *
 * @what     Implementa IJarRepository leyendo la BD simulada `db/jars.json`. Estado en memoria
 *           (mock-stage): siembra desde el JSON y muta el array local. Migrar a backend = otro
 *           adapter del mismo port, sin tocar features.
 */
import { Jar, JarProps } from '@core/entities/Jar';
import { IJarRepository } from '@core/ports/IJarRepository';
import seed from '../db/jars.json';

const toJar = (row: JarProps): Jar => new Jar(row);

export class JsonJarRepository implements IJarRepository {
  private jars: Jar[] = (seed as unknown as JarProps[]).map(toJar);

  async findById(id: string): Promise<Jar | null> {
    return this.jars.find((j) => j.id === id) ?? null;
  }
  async findByWorkspace(workspaceId: string): Promise<Jar[]> {
    return this.jars.filter((j) => j.workspaceId === workspaceId);
  }
  async save(jar: Jar): Promise<void> {
    this.jars = [...this.jars, jar];
  }
  async update(jar: Jar): Promise<void> {
    this.jars = this.jars.map((j) => (j.id === jar.id ? jar : j));
  }
  async delete(id: string): Promise<void> {
    this.jars = this.jars.filter((j) => j.id !== id);
  }
}
