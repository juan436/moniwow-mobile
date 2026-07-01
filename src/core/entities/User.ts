export type UserRole = 'representante' | 'integrante';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaceId: string;
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly workspaceId: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.workspaceId = props.workspaceId;
  }

  isRepresentante(): boolean {
    return this.role === 'representante';
  }

  canRegisterIncome(): boolean {
    return this.role === 'representante';
  }

  canManageDebts(): boolean {
    return this.role === 'representante';
  }
}
