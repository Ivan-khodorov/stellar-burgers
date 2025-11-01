import { ingredientsSlice } from '../ingredients/ingredients-slice';
import { getIngredientsThunk } from '../ingredients'; // экспорт thunk из src/services/ingredients/index.ts

const reducer = ingredientsSlice.reducer;

const mockIngredients = [
  {
    _id: 'ing-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 1255,
    image: 'bun.png',
    image_large: 'bun_l.png',
    image_mobile: 'bun_m.png',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420
  },
  {
    _id: 'ing-2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    price: 424,
    image: 'main.png',
    image_large: 'main_l.png',
    image_mobile: 'main_m.png',
    proteins: 30,
    fat: 18,
    carbohydrates: 40,
    calories: 300
  }
];

describe('ingredientsSlice', () => {
  it('pending: ставит loading = true (isLoading/request-флаг)', () => {
    const next = reducer(undefined, { type: getIngredientsThunk.pending.type });
    expect(next.loading).toBe(true);
    expect(Array.isArray(next.ingredients)).toBe(true);
  });

  it('fulfilled: кладёт ингредиенты в стор и снимает loading', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };
    const next = reducer(undefined, action);

    expect(next.loading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.ingredients).toEqual(mockIngredients);
    expect(next.ingredients).toHaveLength(2);
  });

  it('rejected: записывает ошибку и снимает loading', () => {
    const errorMessage = 'Network error';
    const action = {
      type: getIngredientsThunk.rejected.type,
      payload: errorMessage
    };
    const next = reducer(undefined, action);

    expect(next.loading).toBe(false);
    expect(next.error).toBe(errorMessage);
    expect(next.ingredients).toEqual([]);
  });
});
