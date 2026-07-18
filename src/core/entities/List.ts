// Ítem de una lista de compra. `isChecked` = estado del viaje de compra (deuda técnica H21:
// plantilla y viaje mezclados; se separará al implementar el evento de compra). `approxAmount`
// es opcional: varios ítems no lo traen.
export interface ListItem {
  id: string;
  name: string;
  isChecked: boolean;
  approxAmount?: number;
}

export interface ListProps {
  id: string;
  name: string;
  // El emoji lo ELIGE el usuario al crear la lista (CreateListSheet): es dato suyo, se guarda.
  // No se deriva del jar (cf. H18 aplica al ícono de agenda, no a este avatar propio de la lista).
  emoji: string;
  // Referencia a una jarra real (no label). La etiqueta de la jarra se deriva del jarId en el mapper.
  jarId: string;
  workspaceId: string;
  items: ListItem[];
}

export class List {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly jarId: string;
  readonly workspaceId: string;
  items: ListItem[];

  constructor(props: ListProps) {
    this.id = props.id;
    this.name = props.name;
    this.emoji = props.emoji;
    this.jarId = props.jarId;
    this.workspaceId = props.workspaceId;
    this.items = [...props.items];
  }

  // Suma de los montos aproximados conocidos. Deriva, no se almacena.
  approxTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.approxAmount ?? 0), 0);
  }

  checkedCount(): number {
    return this.items.filter((item) => item.isChecked).length;
  }

  isComplete(): boolean {
    return this.items.length > 0 && this.checkedCount() === this.items.length;
  }
}
