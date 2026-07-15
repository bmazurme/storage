import { Plus } from '@gravity-ui/icons';
import { Button, Icon, Loader, Text } from '@gravity-ui/uikit';
import { useState } from 'react';
import { useCreateStorageMutation, useTreeQuery } from '../api';
import { StorageDialog } from './StorageDialog';
import { StorageNode } from './StorageNode';

export function WarehouseTree() {
  const { data: racks, isLoading, isError } = useTreeQuery();
  const [createOpen, setCreateOpen] = useState(false);
  const [createStorage] = useCreateStorageMutation();

  if (isLoading) {
    return (
      <div className="centered">
        <Loader size="l" />
      </div>
    );
  }

  if (isError) {
    return <Text color="danger">Не удалось загрузить данные склада</Text>;
  }

  return (
    <div>
      <div className="tree-toolbar">
        <Text variant="subheader-2">Стеллажей: {racks?.length ?? 0}</Text>
        <Button view="action" onClick={() => setCreateOpen(true)}>
          <Icon data={Plus} />
          Добавить стеллаж
        </Button>
      </div>
      {racks?.length === 0 && (
        <Text color="secondary">Склад пуст — добавьте первый стеллаж.</Text>
      )}
      {racks?.map((rack) => (
        <StorageNode key={rack.id} type="racks" item={rack} />
      ))}
      <StorageDialog
        open={createOpen}
        title="Новый стеллаж"
        onClose={() => setCreateOpen(false)}
        onSubmit={async (values) => {
          await createStorage({ type: 'racks', body: values }).unwrap();
        }}
      />
    </div>
  );
}
