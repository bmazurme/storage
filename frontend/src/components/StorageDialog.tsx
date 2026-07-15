import { Dialog, Text, TextArea, TextInput } from '@gravity-ui/uikit';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { errorMessage } from '../api';

interface FormValues {
  name: string;
  capacity: number | string;
  description: string;
}

interface Props {
  open: boolean;
  title: string;
  initial?: { name: string; capacity: number; description?: string };
  showDescription?: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    capacity: number;
    description?: string;
  }) => Promise<void>;
}

export function StorageDialog({
  open,
  title,
  initial,
  showDescription = false,
  onClose,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: '', capacity: 0, description: '' },
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? '',
        capacity: initial?.capacity ?? 0,
        description: initial?.description ?? '',
      });
    }
  }, [open, initial, reset]);

  const submit = handleSubmit(async (values) => {
    setBusy(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        capacity: Math.max(0, Number(values.capacity) || 0),
        ...(showDescription ? { description: values.description } : {}),
      });
      onClose();
    } catch (error) {
      alert(`Ошибка сохранения: ${errorMessage(error)}`);
    } finally {
      setBusy(false);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} size="s">
      <Dialog.Header caption={title} />
      <Dialog.Body>
        <form className="form" onSubmit={submit}>
          <div className="form__field">
            <Text variant="body-1">Название</Text>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Укажите название',
                validate: (v) => v.trim().length > 0 || 'Укажите название',
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  size="l"
                  autoFocus
                  placeholder="Например: Стеллаж А"
                  value={field.value as string}
                  onUpdate={field.onChange}
                  validationState={fieldState.error ? 'invalid' : undefined}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>
          <div className="form__field">
            <Text variant="body-1">Вместимость (юнитов)</Text>
            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <TextInput
                  size="l"
                  type="number"
                  placeholder="0 — без ограничения"
                  value={String(field.value)}
                  onUpdate={field.onChange}
                />
              )}
            />
          </div>
          {showDescription && (
            <div className="form__field">
              <Text variant="body-1">Описание</Text>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    size="l"
                    minRows={2}
                    maxRows={5}
                    placeholder="Необязательное описание"
                    value={field.value}
                    onUpdate={field.onChange}
                  />
                )}
              />
            </div>
          )}
        </form>
      </Dialog.Body>
      <Dialog.Footer
        textButtonApply="Сохранить"
        textButtonCancel="Отмена"
        onClickButtonApply={() => void submit()}
        onClickButtonCancel={onClose}
        propsButtonApply={{ loading: busy }}
      />
    </Dialog>
  );
}
