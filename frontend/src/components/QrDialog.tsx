import { Dialog, Label, Text } from '@gravity-ui/uikit';

interface Props {
  open: boolean;
  code: string;
  name: string;
  onClose: () => void;
}

export function QrDialog({ open, code, name, onClose }: Props) {
  const src = `/api/qr/${encodeURIComponent(code)}`;

  const download = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${code}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Dialog open={open} onClose={onClose} size="s">
      <Dialog.Header caption="QR-код" />
      <Dialog.Body>
        <div className="qr-body">
          {open && <img className="qr-body__img" src={src} alt={code} />}
          <Text variant="subheader-1">{name}</Text>
          <Label theme="normal">{code}</Label>
        </div>
      </Dialog.Body>
      <Dialog.Footer
        textButtonApply="Скачать PNG"
        textButtonCancel="Закрыть"
        onClickButtonApply={download}
        onClickButtonCancel={onClose}
      />
    </Dialog>
  );
}
