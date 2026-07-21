export type WorkspaceType = 'individual' | 'hogar';

export interface WorkspaceProps {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId: string;
  memberIds: string[];
  /** Código para unirse a un hogar. Solo lo tienen los `hogar`; los `individual` van sin él. */
  inviteCode?: string;
}

export class Workspace {
  readonly id: string;
  readonly name: string;
  readonly type: WorkspaceType;
  readonly ownerId: string;
  readonly memberIds: string[];
  readonly inviteCode?: string;

  constructor(props: WorkspaceProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.ownerId = props.ownerId;
    this.memberIds = [...props.memberIds];
    this.inviteCode = props.inviteCode;
  }

  isHogar(): boolean {
    return this.type === 'hogar';
  }

  isIndividual(): boolean {
    return this.type === 'individual';
  }

  hasMember(userId: string): boolean {
    return this.memberIds.includes(userId) || this.ownerId === userId;
  }
}
