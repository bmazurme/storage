import { Dialog, Text } from '@gravity-ui/uikit';

interface Props {
  open: boolean;
  imageKey: string;
  name: string;
  onClose: () => void;
}

export function ImageDialog({ open, imageKey, name, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="m">
      <Dialog.Header caption={name} />
      <Dialog.Body>
        <div className="image-dialog">
          {open && (
            <img
              className="image-dialog__img"
              src={`/api/files/${imageKey}`}
              alt={name}
            />
          )}
          <Text variant="caption-2" color="secondary">
            {name}
          </Text>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
