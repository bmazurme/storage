import { Dialog, Text, TextArea, TextInput } from '@gravity-ui/uikit';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  errorMessage,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useUploadMutation,
} from '../api';
import type { Unit } from '../types';

interface FormValues {
  name: string;
  description: string;
  quantity: number | string;
  minQuantity: number | string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  boxId: string;
  unit?: Unit;
}

export function UnitDialog({ open, onClose, boxId, unit }: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: '', description: '', quantity: 0, minQuantity: 5 },
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [upload] = useUploadMutation();
  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();

  useEffect(() => {
    if (open) {
      reset(
        unit
          ? {
              name: unit.name,
              description: unit.description ?? '',
              quantity: unit.quantity,
              minQuantity: unit.minQuantity,
            }
          : { name: '', description: '', quantity: 0, minQuantity: 5 },
      );
      setFile(null);
    }
  }, [open, unit, reset]);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const submit = handleSubmit(async (values) => {
    setBusy(true);
    try {
      let imageKey = unit?.imageKey ?? null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        imageKey = (await upload(formData).unwrap()).key;
      }
      const body = {
        name: values.name.trim(),
        description: values.description,
        quantity: Math.max(0, Number(values.quantity) || 0),
        minQuantity: Math.max(0, Number(values.minQuantity) || 0),
        imageKey,
      };
      if (unit) {
        await updateUnit({ id: unit.id, body }).unwrap();
      } else {
        await createUnit({ ...body, boxId }).unwrap();
      }
      onClose();
    } catch (error) {
      alert(`Ошибка сохранения: ${errorMessage(error)}`);
    } finally {
      setBusy(false);
    }
  });

  const currentImage = previewUrl
    ? previewUrl
    : unit?.imageKey
      ? `/api/files/${unit.imageKey}`
      : null;

  return (
    <Dialog open={open} onClose={onClose} size="s">
      <Dialog.Header caption={unit ? `Юнит: ${unit.name}` : 'Новый юнит'} />
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
                  placeholder="Например: Болт М6×40"
                  value={field.value as string}
                  onUpdate={field.onChange}
                  validationState={fieldState.error ? 'invalid' : undefined}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>
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
                  placeholder="Описание для поиска"
                  value={field.value}
                  onUpdate={field.onChange}
                />
              )}
            />
          </div>
          <div className="form__row">
            <div className="form__field">
              <Text variant="body-1">Количество</Text>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextInput
                    size="l"
                    type="number"
                    value={String(field.value)}
                    onUpdate={field.onChange}
                  />
                )}
              />
            </div>
            <div className="form__field">
              <Text variant="body-1">Мин. остаток</Text>
              <Controller
                name="minQuantity"
                control={control}
                render={({ field }) => (
                  <TextInput
                    size="l"
                    type="number"
                    value={String(field.value)}
                    onUpdate={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className="form__field">
            <Text variant="body-1">Изображение</Text>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {currentImage && (
              <img className="form__image-preview" src={currentImage} alt="Превью" />
            )}
          </div>
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
