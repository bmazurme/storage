export interface Unit {
  id: string;
  name: string;
  description: string;
  imageKey: string | null;
  quantity: number;
  minQuantity: number;
  code: string;
  number: number;
  boxId: string;
}

export interface Box {
  id: string;
  name: string;
  description: string;
  code: string;
  number: number;
  capacity: number;
  containerId: string;
  units: Unit[];
}

export interface Container {
  id: string;
  name: string;
  description: string;
  code: string;
  number: number;
  capacity: number;
  shelfId: string;
  boxes: Box[];
}

export interface Shelf {
  id: string;
  name: string;
  code: string;
  number: number;
  capacity: number;
  rackId: string;
  containers: Container[];
}

export interface Rack {
  id: string;
  name: string;
  code: string;
  number: number;
  capacity: number;
  shelves: Shelf[];
}

export type StorageItem = Rack | Shelf | Container | Box;
export type StorageType = 'racks' | 'shelves' | 'containers' | 'boxes';

export type UnitStatus = 'ok' | 'low' | 'out';

export function unitStatus(unit: Unit): UnitStatus {
  if (unit.quantity <= 0) return 'out';
  if (unit.quantity <= unit.minQuantity) return 'low';
  return 'ok';
}

export const STATUS_META: Record<
  UnitStatus,
  { theme: 'success' | 'warning' | 'danger'; text: string }
> = {
  ok: { theme: 'success', text: 'Достаточно' },
  low: { theme: 'warning', text: 'Заканчивается' },
  out: { theme: 'danger', text: 'Нет на складе' },
};

const CHILD_KEY: Record<Exclude<StorageType, 'boxes'>, StorageType> = {
  racks: 'shelves',
  shelves: 'containers',
  containers: 'boxes',
};

export function sumUnits(item: StorageItem, type: StorageType): number {
  if (type === 'boxes') {
    return ((item as Box).units ?? []).reduce((sum, u) => sum + u.quantity, 0);
  }
  const childType = CHILD_KEY[type as Exclude<StorageType, 'boxes'>];
  const children = ((item as unknown as Record<string, unknown>)[childType] ??
    []) as StorageItem[];
  return children.reduce((sum, child) => sum + sumUnits(child, childType), 0);
}
