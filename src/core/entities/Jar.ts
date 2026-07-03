export type JarType = 'hogar' | 'fondo_seguridad' | 'goals' | 'libre' | 'custom';

export interface JarProps {
  id: string;
  name: string;
  balance: number;
  type: JarType;
  workspaceId: string;
}

export class Jar {
  readonly id: string;
  readonly name: string;
  balance: number;
  readonly type: JarType;
  readonly workspaceId: string;

  constructor(props: JarProps) {
    this.id = props.id;
    this.name = props.name;
    this.balance = props.balance;
    this.type = props.type;
    this.workspaceId = props.workspaceId;
  }

  isNegative(): boolean {
    return this.balance < 0;
  }

  // hogar/fondo_seguridad/goals/libre no se pueden eliminar
  isProtected(): boolean {
    return this.type !== 'custom';
  }

  resetToZero(): void {
    this.balance = 0;
  }
}
