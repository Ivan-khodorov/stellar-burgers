import { createSlice } from '@reduxjs/toolkit';
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
    setNewOrder: (state, action) => {
      state.orderRequest = Boolean(action.payload);
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
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(getOrderNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber =
          Array.isArray(action.payload.orders) && action.payload.orders.length
            ? action.payload.orders[0]
            : null;
      })
      .addCase(getOrderNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postUserBurgerThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;

        state.newOrder.order = null;
        state.newOrder.name = '';
      })
      .addCase(postUserBurgerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;

        state.newOrder.order = action.payload.order;
        state.newOrder.name = action.payload.name;
      })
      .addCase(postUserBurgerThunk.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.feed.orders,
    selectOrdersLoading: (state) => state.loading,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectFeed: (state) => state.feed,
    selectNewOrder: (state) => state.newOrder,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => state.userOrders,
    selectCreatedOrderNumber: (state) =>
      state.newOrder.order &&
      typeof (state.newOrder.order as any).number === 'number'
        ? (state.newOrder.order as any).number
        : null
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
