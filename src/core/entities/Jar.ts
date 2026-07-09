export type JarType = 'hogar' | 'fondo_seguridad' | 'goals' | 'libre' | 'custom';

/**
 * Qué se le puede hacer a una jarra según su tipo. Fuente única de las reglas de negocio de
 * protección (charla UX 2026-07-08). La UI lee esto para deshabilitar controles; los mutadores de
 * estado (store) lo aplican para rechazar cambios que se cuelen. Cambiar la matriz aquí = cambia
 * todo a la vez. Nota blindado: `canToggleBlindado:false` NO fija el valor — el valor lo fija la
 * semilla (Libre nace sin blindar, Fondo/Metas nacen blindadas); el flag solo prohíbe cambiarlo.
 */
export interface JarCapabilities {
  canDelete: boolean;
  canRename: boolean;
  canEditBudget: boolean;
  canToggleBlindado: boolean;
}

const JAR_CAPABILITIES: Record<JarType, JarCapabilities> = {
  libre:           { canDelete: false, canRename: false, canEditBudget: false, canToggleBlindado: false },
  hogar:           { canDelete: false, canRename: false, canEditBudget: true,  canToggleBlindado: true  },
  fondo_seguridad: { canDelete: false, canRename: false, canEditBudget: false, canToggleBlindado: false },
  goals:           { canDelete: false, canRename: false, canEditBudget: false, canToggleBlindado: false },
  custom:          { canDelete: true,  canRename: true,  canEditBudget: true,  canToggleBlindado: true  },
};

export function jarCapabilities(type: JarType): JarCapabilities {
  return JAR_CAPABILITIES[type];
}

export interface JarProps {
  id: string;
  name: string;
  balance: number;
  type: JarType;
  workspaceId: string;
  icon: string;
  isBlindado: boolean;
  targetAmount?: number;
}

export class Jar {
  readonly id: string;
  readonly name: string;
  balance: number;
  readonly type: JarType;
  readonly workspaceId: string;
  readonly icon: string;
  isBlindado: boolean;
  // Presupuesto de la jarra. Solo jarras presupuestables (hogar/custom) lo tienen; undefined = sin presupuesto.
  targetAmount?: number;

  constructor(props: JarProps) {
    this.id = props.id;
    this.name = props.name;
    this.balance = props.balance;
    this.type = props.type;
    this.workspaceId = props.workspaceId;
    this.icon = props.icon;
    this.isBlindado = props.isBlindado;
    this.targetAmount = props.targetAmount;
  }

  isNegative(): boolean {
    return this.balance < 0;
  }

  hasBudget(): boolean {
    return this.targetAmount !== undefined && this.targetAmount > 0;
  }

  // % gastado del presupuesto (0 si no tiene). Deriva, no se almacena.
  budgetPercent(): number {
    if (!this.hasBudget()) return 0;
    return Math.min((this.balance / (this.targetAmount as number)) * 100, 100);
  }

  // hogar/fondo_seguridad/goals/libre no se pueden eliminar
  isProtected(): boolean {
    return this.type !== 'custom';
  }

  resetToZero(): void {
    this.balance = 0;
  }
}
