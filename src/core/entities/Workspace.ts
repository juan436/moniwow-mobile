export type WorkspaceType = 'individual' | 'hogar';

export interface WorkspaceProps {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId: string;
  memberIds: string[];
}

export class Workspace {
  readonly id: string;
  readonly name: string;
  readonly type: WorkspaceType;
  readonly ownerId: string;
  readonly memberIds: string[];

  constructor(props: WorkspaceProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.ownerId = props.ownerId;
    this.memberIds = [...props.memberIds];
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
