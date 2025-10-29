import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsThunk,
  getOrderNumberThunk,
  getUserOrdersThunk,
  postUserBurgerThunk
} from './index';

export interface OrderState {
  feed: {
    success: boolean;
    total: number;
    totalToday: number;
    orders: TOrder[];
  };
  userOrders: TOrder[];
  orderByNumber: TOrder | null;
  newOrder: {
    order: TOrder | null;
    name: string;
  };
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  feed: {
    success: false,
    total: 0,
    totalToday: 0,
    orders: []
  },
  userOrders: [],
  orderByNumber: null,
  newOrder: {
    order: null,
    name: ''
  },
  orderRequest: false,
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setNewOrder: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
      state.newOrder.order = null;
      state.newOrder.name = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFeedsThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            success: boolean;
            total: number;
            totalToday: number;
            orders: TOrder[];
          }>
        ) => {
          state.loading = false;
          state.feed = action.payload;
        }
      )
      .addCase(
        getFeedsThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка загрузки ленты заказов';
        }
      )

      .addCase(getOrderNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(
        getOrderNumberThunk.fulfilled,
        (state, action: PayloadAction<{ orders: TOrder[] }>) => {
          state.loading = false;
          state.orderByNumber =
            action.payload.orders.length > 0 ? action.payload.orders[0] : null;
        }
      )
      .addCase(
        getOrderNumberThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка получения заказа по номеру';
        }
      )

      .addCase(postUserBurgerThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
        state.newOrder.order = null;
        state.newOrder.name = '';
      })
      .addCase(
        postUserBurgerThunk.fulfilled,
        (state, action: PayloadAction<{ order: TOrder; name: string }>) => {
          state.loading = false;
          state.orderRequest = false;
          state.newOrder.order = action.payload.order;
          state.newOrder.name = action.payload.name;
        }
      )
      .addCase(
        postUserBurgerThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.orderRequest = false;
          state.error = action.payload ?? 'Ошибка отправки заказа';
        }
      )

      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(
        getUserOrdersThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error =
            action.payload ?? 'Ошибка получения заказов пользователя';
        }
      );
  },
  selectors: {
    selectFeedOrders: (state) => state.feed.orders,
    selectOrdersLoading: (state) => state.loading,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectFeed: (state) => state.feed,
    selectNewOrder: (state) => state.newOrder,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => state.userOrders,
    selectCreatedOrderNumber: (state) => state.newOrder.order?.number ?? null
  }
});

export const {
  selectFeedOrders,
  selectOrdersLoading,
  selectOrderByNumber,
  selectFeed,
  selectNewOrder,
  selectOrderRequest,
  selectUserOrders,
  selectCreatedOrderNumber
} = ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;
export const { setNewOrder } = ordersSlice.actions;
