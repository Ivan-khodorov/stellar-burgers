import { rootReducer } from '../reducers';
import { constructorSlice } from '../constructor/constructor-slice';
import { ingredientsSlice } from '../ingredients/ingredients-slice';
import { ordersSlice } from '../orders/orders-slice';
import { userSlice } from '../users/users-slice';

describe('rootReducer', () => {
  it('содержит все ожидаемые слайсы', () => {
    const state: any = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty(ingredientsSlice.name);
    expect(state).toHaveProperty(constructorSlice.name);
    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(ordersSlice.name);
  });

  it('корректно инициализирует state по умолчанию', () => {
    const state: any = rootReducer(undefined, { type: '@@INIT' });

    expect(state[ingredientsSlice.name]).toEqual({
      ingredients: [],
      loading: false, // <-- в слайсе именно loading
      error: null
    });

    expect(state[constructorSlice.name]).toEqual({
      burger: { bun: null, ingredients: [] },
      isLoading: false,
      error: null
    });

    expect(state[userSlice.name]).toEqual({
      user: null,
      isAuthChecked: false,
      loading: false,
      error: null
    });

    expect(state[ordersSlice.name]).toEqual({
      feed: { success: false, total: 0, totalToday: 0, orders: [] },
      userOrders: [],
      orderByNumber: null,
      newOrder: { order: null, name: '' },
      orderRequest: false,
      loading: false,
      error: null
    });
  });
});
