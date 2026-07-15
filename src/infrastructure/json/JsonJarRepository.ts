/**
 * JsonJarRepository — Adapter (mock)
 *
 * @what     Implementa IJarRepository leyendo la BD simulada `db/jars.json`. Estado en memoria
 *           (mock-stage): siembra desde el JSON y muta el array local. Migrar a backend = otro
 *           adapter del mismo port, sin tocar features.
 * @processes **El `balance` NO está en el JSON: se DERIVA del libro** (C4). En cada lectura suma las
 *           transacciones de la jarra vía `ComputeJarBalances`. En Mongo esto es un `$group` sobre
 *           `transactions`; aquí es la misma agregación en memoria. Por eso el repo depende de
 *           `ITransactionRepository` — el libro es la fuente, la jarra es una vista.
 */
import { Jar, JarProps } from '@core/entities/Jar';
import { IJarRepository } from '@core/ports/IJarRepository';
import { ITransactionRepository } from '@core/ports/ITransactionRepository';
import { ComputeJarBalances } from '@core/use-cases/ComputeJarBalances';
import seed from '../db/jars.json';

type JarRow = Omit<JarProps, 'balance'>;

export class JsonJarRepository implements IJarRepository {
  private rows: JarRow[] = seed as unknown as JarRow[];
  private readonly computeBalances = new ComputeJarBalances();

  constructor(private readonly transactionRepo: ITransactionRepository) {}

  /** Jarra + su balance derivado del libro. Sin movimientos → 0, no un número inventado. */
  private async hydrate(rows: JarRow[], workspaceId: string): Promise<Jar[]> {
    const txs = await this.transactionRepo.findByWorkspace(workspaceId);
    const balances = this.computeBalances.execute(txs);
    return rows.map((row) => new Jar({ ...row, balance: balances.get(row.id) ?? 0 }));
  }

  async findById(id: string): Promise<Jar | null> {
    const row = this.rows.find((j) => j.id === id);
    if (!row) return null;
    const [jar] = await this.hydrate([row], row.workspaceId);
    return jar;
  }

  async findByWorkspace(workspaceId: string): Promise<Jar[]> {
    return this.hydrate(
      this.rows.filter((j) => j.workspaceId === workspaceId),
      workspaceId,
    );
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
