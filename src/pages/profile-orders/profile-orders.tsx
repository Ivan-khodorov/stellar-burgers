import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  selectNewOrder,
  selectUserOrders,
  selectOrdersLoading
} from '../../services/orders/orders-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/users/users-slice';
import { getUserOrdersThunk } from '../../services/orders';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrdersLoading);
  const user = useSelector(selectUser);
  const newOrder = useSelector(selectNewOrder);

  useEffect(() => {
    if (user) {
      dispatch(getUserOrdersThunk());
    }
  }, [dispatch, user, newOrder]);

  if (loading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
