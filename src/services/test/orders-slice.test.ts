import { ordersSlice, setNewOrder } from '../orders/orders-slice';
import {
  getFeedsThunk,
  getOrderNumberThunk,
  postUserBurgerThunk,
  getUserOrdersThunk
} from '../orders';
import type { TOrder } from '@utils-types';

const reducer = ordersSlice.reducer;

const order: TOrder = {
  _id: 'o1',
  number: 123456,
  name: 'Тестовый заказ',
  status: 'done',
  ingredients: ['ing-1', 'ing-2'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

describe('ordersSlice', () => {
  it('setNewOrder: меняет флаги и очищает newOrder', () => {
    const state1 = reducer(undefined, setNewOrder(true));
    expect(state1.orderRequest).toBe(true);
    expect(state1.newOrder.order).toBeNull();
    expect(state1.newOrder.name).toBe('');

    const state2 = reducer(state1, setNewOrder(false));
    expect(state2.orderRequest).toBe(false);
    expect(state2.newOrder.order).toBeNull();
    expect(state2.newOrder.name).toBe('');
  });

  it('postUserBurgerThunk.pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: postUserBurgerThunk.pending.type });
    expect(state.loading).toBe(true);
    expect(state.orderRequest).toBe(true);
    expect(state.newOrder.order).toBeNull();

    state = reducer(undefined, {
      type: postUserBurgerThunk.fulfilled.type,
      payload: { order, name: 'Готово' }
    });
    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.newOrder.order?.number).toBe(123456);
    expect(state.newOrder.name).toBe('Готово');

    state = reducer(undefined, {
      type: postUserBurgerThunk.rejected.type,
      payload: 'Ошибка'
    });
    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('getFeedsThunk.pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: getFeedsThunk.pending.type });
    expect(state.loading).toBe(true);

    state = reducer(undefined, {
      type: getFeedsThunk.fulfilled.type,
      payload: {
        success: true,
        total: 10,
        totalToday: 1,
        orders: [order]
      }
    });
    expect(state.loading).toBe(false);
    expect(state.feed.orders).toHaveLength(1);
    expect(state.feed.total).toBe(10);
    expect(state.feed.totalToday).toBe(1);

    state = reducer(undefined, {
      type: getFeedsThunk.rejected.type,
      payload: 'Ошибка ленты'
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка ленты');
  });

  it('getOrderNumberThunk.pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: getOrderNumberThunk.pending.type });
    expect(state.loading).toBe(true);
    expect(state.orderByNumber).toBeNull();

    state = reducer(undefined, {
      type: getOrderNumberThunk.fulfilled.type,
      payload: { orders: [order] }
    });
    expect(state.loading).toBe(false);
    expect(state.orderByNumber?.number).toBe(123456);

    state = reducer(undefined, {
      type: getOrderNumberThunk.rejected.type,
      payload: 'Ошибка номера'
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка номера');
  });

  it('getUserOrdersThunk.pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: getUserOrdersThunk.pending.type });
    expect(state.loading).toBe(true);

    state = reducer(undefined, {
      type: getUserOrdersThunk.fulfilled.type,
      payload: [order]
    });
    expect(state.loading).toBe(false);
    expect(state.userOrders).toHaveLength(1);

    state = reducer(undefined, {
      type: getUserOrdersThunk.rejected.type,
      payload: 'Ошибка мои заказы'
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка мои заказы');
  });
});
