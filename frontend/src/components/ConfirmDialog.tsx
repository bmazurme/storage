import { Dialog, Text } from '@gravity-ui/uikit';
import { useState } from 'react';

interface Props {
  open: boolean;
  caption: string;
  message: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({ open, caption, message, onClose, onConfirm }: Props) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} size="s">
      <Dialog.Header caption={caption} />
      <Dialog.Body>
        <Text variant="body-1">{message}</Text>
      </Dialog.Body>
      <Dialog.Footer
        textButtonApply="Удалить"
        textButtonCancel="Отмена"
        onClickButtonApply={() => void confirm()}
        onClickButtonCancel={onClose}
        propsButtonApply={{ view: 'outlined-danger', loading: busy }}
      />
    </Dialog>
  );
}
