import { FC, PropsWithChildren } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from '@components';

export const OrderInfoModal: FC<PropsWithChildren<{ onClose: () => void }>> = ({
  onClose,
  children
}) => {
  const { number } = useParams<{ number: string }>();
  const title = number ? `Заказ #${String(number).padStart(6, '0')}` : '';
  return (
    <Modal title={title} onClose={onClose}>
      {children}
    </Modal>
  );
};
