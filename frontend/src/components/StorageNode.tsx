import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  QrCode,
  TrashBin,
} from '@gravity-ui/icons';
import { Button, Icon, Label, Progress, Text } from '@gravity-ui/uikit';
import { useState } from 'react';
import {
  errorMessage,
  useCreateStorageMutation,
  useDeleteStorageMutation,
  useUpdateStorageMutation,
} from '../api';
import type { Box, Container, StorageItem, StorageType } from '../types';
import { sumUnits } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { QrDialog } from './QrDialog';
import { StorageDialog } from './StorageDialog';
import { UnitDialog } from './UnitDialog';
import { UnitList } from './UnitList';

interface LevelConfig {
  label: string;
  accusative: string;
  childType: StorageType | null;
  childAccusative: string;
  parentField: string;
  hasDescription: boolean;
}

const CONFIG: Record<StorageType, LevelConfig> = {
  racks: {
    label: 'Стеллаж',
    accusative: 'стеллаж',
    childType: 'shelves',
    childAccusative: 'полку',
    parentField: 'rackId',
    hasDescription: false,
  },
  shelves: {
    label: 'Полка',
    accusative: 'полку',
    childType: 'containers',
    childAccusative: 'контейнер',
    parentField: 'shelfId',
    hasDescription: false,
  },
  containers: {
    label: 'Контейнер',
    accusative: 'контейнер',
    childType: 'boxes',
    childAccusative: 'бокс',
    parentField: 'containerId',
    hasDescription: true,
  },
  boxes: {
    label: 'Бокс',
    accusative: 'бокс',
    childType: null,
    childAccusative: 'юнит',
    parentField: 'boxId',
    hasDescription: true,
  },
};

export function StorageNode({ type, item }: { type: StorageType; item: StorageItem }) {
  const config = CONFIG[type];
  const [expanded, setExpanded] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createStorage] = useCreateStorageMutation();
  const [updateStorage] = useUpdateStorageMutation();
  const [deleteStorage] = useDeleteStorageMutation();

  const children = config.childType
    ? (((item as unknown as Record<string, unknown>)[config.childType] ??
        []) as StorageItem[])
    : [];
  const units = type === 'boxes' ? ((item as Box).units ?? []) : [];
  const used = sumUnits(item, type);
  const percent = item.capacity > 0 ? Math.round((used / item.capacity) * 100) : 0;
  const capacityTheme =
    percent > 100 ? 'danger' : percent >= 80 ? 'warning' : 'success';

  const handleDelete = async () => {
    try {
      await deleteStorage({ type, id: item.id }).unwrap();
    } catch (error) {
      alert(`Ошибка удаления: ${errorMessage(error)}`);
    }
  };

  return (
    <div className="node">
      <div className="node__header">
        <Button view="flat" size="s" onClick={() => setExpanded(!expanded)}>
          <Icon data={expanded ? ChevronDown : ChevronRight} />
        </Button>
        <div className="node__title">
          <Text variant="caption-2" color="secondary">
            {config.label}
          </Text>
          <Text variant="subheader-1" ellipsis>
            {item.name}
          </Text>
          <Label size="s" theme="normal">
            {item.code}
          </Label>
        </div>
        <div className="node__cap">
          {item.capacity > 0 && (
            <>
              <div className="node__cap-bar">
                <Progress
                  size="s"
                  theme={capacityTheme}
                  value={Math.min(percent, 100)}
                />
              </div>
              <Text variant="caption-2" color="secondary">
                {used}/{item.capacity} юн.
              </Text>
            </>
          )}
        </div>
        <div className="node__actions">
          <Button
            size="s"
            view="outlined"
            onClick={() => setAddOpen(true)}
            title={`Добавить ${config.childAccusative}`}
          >
            <Icon data={Plus} />
            {type === 'boxes' ? 'Юнит' : null}
          </Button>
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
      </div>

      {config.hasDescription && (item as Container | Box).description && (
        <div className="node__description">
          <Text variant="caption-2" color="secondary">
            {(item as Container | Box).description}
          </Text>
        </div>
      )}

      {expanded && type === 'boxes' && (
        <div>
          {units.length === 0 ? (
            <div className="node__empty">
              <Text variant="caption-2" color="secondary">
                Бокс пуст
              </Text>
            </div>
          ) : (
            <UnitList boxId={item.id} units={units} />
          )}
        </div>
      )}

      {expanded && type !== 'boxes' && children.length > 0 && (
        <div className="node__children">
          {children.map((child) => (
            <StorageNode key={child.id} type={config.childType!} item={child} />
          ))}
        </div>
      )}

      <StorageDialog
        open={editOpen}
        title={`${config.label}: ${item.name}`}
        initial={{
          name: item.name,
          capacity: item.capacity,
          description: config.hasDescription
            ? (item as Container | Box).description
            : undefined,
        }}
        showDescription={config.hasDescription}
        onClose={() => setEditOpen(false)}
        onSubmit={async (values) => {
          await updateStorage({ type, id: item.id, body: values }).unwrap();
        }}
      />

      {config.childType ? (
        <StorageDialog
          open={addOpen}
          title={`Добавить ${config.childAccusative} в «${item.name}»`}
          showDescription={CONFIG[config.childType].hasDescription}
          onClose={() => setAddOpen(false)}
          onSubmit={async (values) => {
            await createStorage({
              type: config.childType!,
              body: { ...values, [config.parentField]: item.id },
            }).unwrap();
          }}
        />
      ) : (
        <UnitDialog open={addOpen} boxId={item.id} onClose={() => setAddOpen(false)} />
      )}

      <QrDialog
        open={qrOpen}
        code={item.code}
        name={item.name}
        onClose={() => setQrOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        caption={`Удалить ${config.accusative}?`}
        message={`Удалить ${config.accusative} «${item.name}» со всем содержимым?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
