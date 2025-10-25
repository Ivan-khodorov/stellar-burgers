import { combineSlices } from '@reduxjs/toolkit';
import { constructorSlice } from './constructor/constructor-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { ordersSlice } from './orders/orders-slice';
import { userSlice } from './users/users-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  userSlice,
  ordersSlice
);
