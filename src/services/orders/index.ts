import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getFeedsThunk = createAsyncThunk<
  { success: boolean; total: number; totalToday: number; orders: TOrder[] },
  void,
  { rejectValue: string }
>('feed/fetchInfo', async (_, { rejectWithValue }) => {
  try {
    const resp = await getFeedsApi();
    const data = (resp as any)?.data ?? resp;

    return {
      success:
        typeof data?.success === 'boolean'
          ? data.success
          : Boolean(data?.orders),
      total: Number(data?.total ?? 0),
      totalToday: Number(data?.totalToday ?? 0),
      orders: Array.isArray(data?.orders) ? (data.orders as TOrder[]) : []
    };
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Ошибка загрузки ленты заказов');
  }
});

export const getOrderNumberThunk = createAsyncThunk<
  { orders: TOrder[] },
  number,
  { rejectValue: string }
>('feed/fetchByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const resp = await getOrderByNumberApi(orderNumber);
    const data = (resp as any)?.data ?? resp;
    const orders: TOrder[] = Array.isArray(data?.orders)
      ? (data.orders as TOrder[])
      : data?.order
        ? [data.order as TOrder]
        : [];
    return { orders };
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Ошибка получения заказа по номеру');
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
      const resp = await orderBurgerApi(userBurgerIngredients);
      const data = (resp as any)?.data ?? resp;

      const order: TOrder | undefined =
        (data?.order as TOrder | undefined) ??
        (Array.isArray(data?.orders) ? (data.orders[0] as TOrder) : undefined);

      const name: string =
        (data?.name as string | undefined) ??
        (order && (order as any).name) ??
        '';

      if (!order || typeof (order as any).number !== 'number') {
        return rejectWithValue('Некорректный ответ сервера: нет номера заказа');
      }

      return { order, name };
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Ошибка отправки заказа');
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
    return orders;
  } catch (err: any) {
    return rejectWithValue(
      err?.message || 'Ошибка получения заказов пользователя'
    );
  }
});
