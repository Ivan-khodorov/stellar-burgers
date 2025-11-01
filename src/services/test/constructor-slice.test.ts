import {
  constructorReducer,
  initialState,
  addIngredient,
  removeIngredient,
  swapIngredient
} from '../constructor/constructor-slice';
import { TIngredient } from '@utils-types';

const makeIng = (over: Partial<TIngredient>): TIngredient => ({
  _id: over._id ?? 'id',
  name: over.name ?? 'name',
  type: over.type ?? 'main', // 'bun' | 'main' | 'sauce'
  proteins: over.proteins ?? 0,
  fat: over.fat ?? 0,
  carbohydrates: over.carbohydrates ?? 0,
  calories: over.calories ?? 0,
  price: over.price ?? 100,
  image: over.image ?? 'img',
  image_large: over.image_large ?? 'imgL',
  image_mobile: over.image_mobile ?? 'imgM'
});

describe('constructorSlice reducer', () => {
  it('добавляет ингредиенты: булка в bun, начинка в массив', () => {
    const bun = makeIng({
      _id: 'bun-1',
      name: 'Булка',
      type: 'bun',
      price: 1255
    });
    const main1 = makeIng({
      _id: 'main-1',
      name: 'Начинка-1',
      type: 'main',
      price: 424
    });

    let state = constructorReducer(initialState, addIngredient(bun));
    expect(state.burger.bun?._id).toBe('bun-1');
    expect(state.burger.ingredients).toHaveLength(0);

    state = constructorReducer(state, addIngredient(main1));
    expect(state.burger.ingredients).toHaveLength(1);
    expect(state.burger.ingredients[0]._id).toBe('main-1');

    const bun2 = makeIng({ _id: 'bun-2', name: 'Булка-2', type: 'bun' });
    state = constructorReducer(state, addIngredient(bun2));
    expect(state.burger.bun?._id).toBe('bun-2');
  });

  it('удаляет начинку по id экземпляра (constructor id)', () => {
    const main1 = makeIng({ _id: 'main-1', name: 'A', type: 'main' });
    const main2 = makeIng({ _id: 'main-2', name: 'B', type: 'main' });

    let state = constructorReducer(initialState, addIngredient(main1));
    state = constructorReducer(state, addIngredient(main2));

    expect(state.burger.ingredients).toHaveLength(2);
    const idToRemove = state.burger.ingredients[0].id; // constructor-id

    state = constructorReducer(state, removeIngredient(idToRemove));
    expect(state.burger.ingredients).toHaveLength(1);
    expect(state.burger.ingredients[0]._id).toBe('main-2');
  });

  it('меняет порядок начинок (swapIngredient) и игнорирует некорректные индексы', () => {
    const m1 = makeIng({ _id: 'm1', name: 'M1', type: 'main' });
    const m2 = makeIng({ _id: 'm2', name: 'M2', type: 'main' });
    const m3 = makeIng({ _id: 'm3', name: 'M3', type: 'main' });

    let state = constructorReducer(initialState, addIngredient(m1));
    state = constructorReducer(state, addIngredient(m2));
    state = constructorReducer(state, addIngredient(m3));

    const order = state.burger.ingredients.map((x) => x._id);
    expect(order).toEqual(['m1', 'm2', 'm3']);

    state = constructorReducer(state, swapIngredient({ first: 0, second: 1 }));
    expect(state.burger.ingredients.map((x) => x._id)).toEqual([
      'm2',
      'm1',
      'm3'
    ]);

    const before = state.burger.ingredients.map((x) => x._id);
    state = constructorReducer(state, swapIngredient({ first: -1, second: 5 }));
    expect(state.burger.ingredients.map((x) => x._id)).toEqual(before);
  });
});
