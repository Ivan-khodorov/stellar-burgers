import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  selectFeedOrders,
  selectOrdersLoading
} from '../../services/orders/orders-slice';
import { getFeedsThunk } from '../../services/orders';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  const feedOrders = useSelector(selectFeedOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  if (ordersLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feedOrders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
