import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export interface ConstructorState {
  burger: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | null;
}

export const initialState: ConstructorState = {
  burger: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: null
};

export const constructorSlice = createSlice({
  name: 'myconstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ing = action.payload;
        if (ing.type === 'bun') {
          state.burger.bun = ing;
          return;
        }
        state.burger.ingredients.push(ing);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid(); // уникальный id экземпляра в конструкторе
        const payload: TConstructorIngredient = { ...ingredient, id };
        return { payload };
      }
    },

    swapIngredient: (
      state,
      action: PayloadAction<{ first: number; second: number }>
    ) => {
      const { first, second } = action.payload;
      const arr = state.burger.ingredients;

      if (
        first === second ||
        first < 0 ||
        second < 0 ||
        first >= arr.length ||
        second >= arr.length
      ) {
        return;
      }

      [arr[first], arr[second]] = [arr[second], arr[first]];
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.burger.ingredients.findIndex((ing) => ing.id === id);
      if (idx !== -1) {
        state.burger.ingredients.splice(idx, 1);
      }
    },

    clearBurger: (state) => {
      state.burger.bun = null;
      state.burger.ingredients = [];
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state.burger
  }
});
export const { selectBurgerConstructor } = constructorSlice.selectors;

export const { addIngredient, removeIngredient, clearBurger, swapIngredient } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
