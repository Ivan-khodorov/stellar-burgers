import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: Record<string, string> = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан',
  canceled: 'Отменён',
  cancelled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let color = '';
  switch (status) {
    case 'pending':
      color = '#E52B1A';
      break;
    case 'done':
      color = '#00CCCC';
      break;
    default:
      color = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={color} text={statusText[status] || ''} />;
};
