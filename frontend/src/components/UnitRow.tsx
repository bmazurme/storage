import { Grip, Minus, Pencil, Picture, Plus, QrCode, TrashBin } from '@gravity-ui/icons';
import { Button, Icon, Label, Text } from '@gravity-ui/uikit';
import { forwardRef, useState } from 'react';
import type { ConnectDragSource } from 'react-dnd';
import { errorMessage, useDeleteUnitMutation, useUpdateUnitMutation } from '../api';
import type { Unit } from '../types';
import { STATUS_META, unitStatus } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { ImageDialog } from './ImageDialog';
import { QrDialog } from './QrDialog';
import { UnitDialog } from './UnitDialog';

interface Props {
  unit: Unit;
  showCode?: boolean;
  dragHandleRef?: ConnectDragSource;
  isDragging?: boolean;
}

export const UnitRow = forwardRef<HTMLDivElement, Props>(function UnitRow(
  { unit, showCode = false, dragHandleRef, isDragging = false },
  rootRef,
) {
  const [editOpen, setEditOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();

  const status = STATUS_META[unitStatus(unit)];

  const setQuantity = async (quantity: number) => {
    try {
      await updateUnit({ id: unit.id, body: { quantity: Math.max(0, quantity) } }).unwrap();
    } catch (error) {
      alert(`Ошибка: ${errorMessage(error)}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUnit(unit.id).unwrap();
    } catch (error) {
      alert(`Ошибка удаления: ${errorMessage(error)}`);
    }
  };

  return (
    <div
      className="unit-row"
      ref={rootRef}
      style={isDragging ? { opacity: 0.4 } : undefined}
    >
      {dragHandleRef && (
        <div className="unit-row__drag-handle" ref={dragHandleRef} title="Перетащить">
          <Icon data={Grip} size={16} />
        </div>
      )}
      {unit.imageKey ? (
        <button
          type="button"
          className="unit-row__thumb-button"
          onClick={() => setImageOpen(true)}
          title="Открыть изображение"
        >
          <img
            className="unit-row__thumb"
            src={`/api/files/${unit.imageKey}`}
            alt={unit.name}
          />
        </button>
      ) : (
        <div className="unit-row__thumb-empty">
          <Icon data={Picture} size={16} />
        </div>
      )}
      <div className="unit-row__info">
        <Text variant="body-2">{unit.name}</Text>
        {unit.description && (
          <Text variant="caption-2" color="secondary" ellipsis title={unit.description}>
            {unit.description}
          </Text>
        )}
      </div>
      {showCode && (
        <Label size="s" theme="normal">
          {unit.code}
        </Label>
      )}
      <Label size="s" theme={status.theme}>
        {status.text}
      </Label>
      <div className="unit-row__qty">
        <Button
          size="s"
          view="flat"
          disabled={unit.quantity <= 0}
          onClick={() => setQuantity(unit.quantity - 1)}
        >
          <Icon data={Minus} />
        </Button>
        <Text variant="body-2" className="unit-row__count">
          {unit.quantity}
        </Text>
        <Button size="s" view="flat" onClick={() => setQuantity(unit.quantity + 1)}>
          <Icon data={Plus} />
        </Button>
      </div>
      <div className="node__actions">
        <Button size="s" view="flat" onClick={() => setQrOpen(true)} title="QR-код">
          <Icon data={QrCode} />
        </Button>
        <Button
          size="s"
          view="flat"
          onClick={() => setEditOpen(true)}
          title="Редактировать"
        >
          <Icon data={Pencil} />
        </Button>
        <Button
          size="s"
          view="flat-danger"
          onClick={() => setDeleteOpen(true)}
          title="Удалить"
        >
          <Icon data={TrashBin} />
        </Button>
      </div>
      <UnitDialog
        open={editOpen}
        unit={unit}
        boxId={unit.boxId}
        onClose={() => setEditOpen(false)}
      />
      <QrDialog
        open={qrOpen}
        code={unit.code}
        name={unit.name}
        onClose={() => setQrOpen(false)}
      />
      {unit.imageKey && (
        <ImageDialog
          open={imageOpen}
          imageKey={unit.imageKey}
          name={unit.name}
          onClose={() => setImageOpen(false)}
        />
      )}
      <ConfirmDialog
        open={deleteOpen}
        caption="Удалить юнит?"
        message={`Удалить юнит «${unit.name}»?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
});
