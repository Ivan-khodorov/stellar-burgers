import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type MaybeData<T> = T | { data: T };

function unwrap<T>(x: MaybeData<T>): T {
  return x && typeof x === 'object' && 'data' in x
    ? (x as { data: T }).data
    : (x as T);
}

function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e ?? 'Неизвестная ошибка');
}

const toNumber = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const isTOrder = (v: unknown): v is TOrder =>
  typeof v === 'object' && v !== null && 'number' in v;

export const getFeedsThunk = createAsyncThunk<
  { success: boolean; total: number; totalToday: number; orders: TOrder[] },
  void,
  { rejectValue: string }
>('feed/fetchInfo', async (_, { rejectWithValue }) => {
  try {
    interface FeedPayload {
      success?: boolean;
      total?: unknown;
      totalToday?: unknown;
      orders?: unknown;
    }

    const resp = await getFeedsApi();
    const data = unwrap<FeedPayload>(resp as MaybeData<FeedPayload>);

    const orders: TOrder[] = Array.isArray(data.orders)
      ? data.orders.filter(isTOrder)
      : [];

    return {
      success:
        typeof data.success === 'boolean' ? data.success : orders.length > 0,
      total: toNumber(data.total),
      totalToday: toNumber(data.totalToday),
      orders
    };
  } catch (e) {
    return rejectWithValue(getMessage(e) || 'Ошибка загрузки ленты заказов');
  }
});

export const getOrderNumberThunk = createAsyncThunk<
  { orders: TOrder[] },
  number,
  { rejectValue: string }
>('feed/fetchByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    interface OrderPayload {
      orders?: unknown;
      order?: unknown;
    }

    const resp = await getOrderByNumberApi(orderNumber);
    const data = unwrap<OrderPayload>(resp as MaybeData<OrderPayload>);

    const ordersArray: TOrder[] = Array.isArray(data.orders)
      ? data.orders.filter(isTOrder)
      : data.order && isTOrder(data.order)
        ? [data.order]
        : [];

    return { orders: ordersArray };
  } catch (e) {
    return rejectWithValue(
      getMessage(e) || 'Ошибка получения заказа по номеру'
    );
  }
});

export const postUserBurgerThunk = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string }
>(
  'order/postUserBurger',
  async (userBurgerIngredients, { rejectWithValue }) => {
    try {
      interface PostOrderPayload {
        order?: unknown;
        orders?: unknown;
        name?: unknown;
      }

      const resp = await orderBurgerApi(userBurgerIngredients);
      const data = unwrap<PostOrderPayload>(
        resp as MaybeData<PostOrderPayload>
      );

      const order: TOrder | undefined =
        (Array.isArray(data.orders) && data.orders.find(isTOrder)) ||
        (isTOrder(data.order) ? data.order : undefined);

      if (!order) {
        return rejectWithValue('Некорректный ответ сервера: нет данных заказа');
      }

      const name =
        typeof data.name === 'string' && data.name.trim().length > 0
          ? data.name
          : order.name;

      return { order, name };
    } catch (e) {
      return rejectWithValue(getMessage(e) || 'Ошибка отправки заказа');
    }
  }
);

export const getUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/getUserOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return Array.isArray(orders) ? orders.filter(isTOrder) : [];
  } catch (e) {
    return rejectWithValue(
      getMessage(e) || 'Ошибка получения заказов пользователя'
    );
  }
});
