import { useCallback, useEffect, useRef, useState } from 'react';
import { useReorderUnitsMutation } from '../api';
import type { Unit } from '../types';
import { DraggableUnitRow } from './DraggableUnitRow';

export function UnitList({ boxId, units }: { boxId: string; units: Unit[] }) {
  const [ordered, setOrdered] = useState(units);
  const orderedRef = useRef(units);
  const [reorderUnits] = useReorderUnitsMutation();

  useEffect(() => {
    setOrdered(units);
    orderedRef.current = units;
  }, [units]);

  const moveUnit = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrdered((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, moved);
      orderedRef.current = next;
      return next;
    });
  }, []);

  const persistOrder = useCallback(() => {
    reorderUnits({ boxId, unitIds: orderedRef.current.map((u) => u.id) });
  }, [boxId, reorderUnits]);

  return (
    <div>
      {ordered.map((unit, index) => (
        <DraggableUnitRow
          key={unit.id}
          unit={unit}
          index={index}
          moveUnit={moveUnit}
          onDrop={persistOrder}
        />
      ))}
    </div>
  );
}
