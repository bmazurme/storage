import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Unit } from '../types';
import { UnitRow } from './UnitRow';

const ITEM_TYPE = 'unit-row';

interface DragItem {
  id: string;
  index: number;
}

interface Props {
  unit: Unit;
  index: number;
  moveUnit: (dragIndex: number, hoverIndex: number) => void;
  onDrop: () => void;
}

export function DraggableUnitRow({ unit, index, moveUnit, onDrop }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(
    () => ({
      type: ITEM_TYPE,
      item: { id: unit.id, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      end: (_item, monitor) => {
        if (monitor.didDrop()) onDrop();
      },
    }),
    [unit.id, index, onDrop],
  );

  const [, drop] = useDrop<DragItem>(
    () => ({
      accept: ITEM_TYPE,
      hover: (item, monitor) => {
        if (!rowRef.current || item.index === index) return;
        const hoverRect = rowRef.current.getBoundingClientRect();
        const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientY = clientOffset.y - hoverRect.top;
        if (item.index < index && hoverClientY < hoverMiddleY) return;
        if (item.index > index && hoverClientY > hoverMiddleY) return;
        moveUnit(item.index, index);
        item.index = index;
      },
    }),
    [index, moveUnit],
  );

  drop(rowRef);

  return (
    <UnitRow ref={rowRef} unit={unit} dragHandleRef={drag} isDragging={isDragging} />
  );
}
