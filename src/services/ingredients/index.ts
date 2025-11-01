import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const getMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  return String(e ?? 'Неизвестная ошибка');
};
async function fetchIngredientsFallback(): Promise<TIngredient[]> {
  const url = 'https://norma.nomoreparties.space/api/ingredients';

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });

  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  if (!isJson) {
    const preview = (await res.text()).slice(0, 120);
    throw new Error(
      `Ожидался JSON от fallback API, получено: ${ct || 'неизвестно'}. Фрагмент: ${preview}`
    );
  }

  type FallbackJson = { success?: boolean; data?: unknown };
  const json: unknown = await res.json();

  if (
    !res.ok ||
    !isObject(json) ||
    json.success !== true ||
    !Array.isArray(json.data)
  ) {
    throw new Error('Некорректный формат: нет массива data');
  }

  return json.data as TIngredient[];
}

export const getIngredientsThunk = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const list = await getIngredientsApi();
    if (Array.isArray(list)) {
      return list as TIngredient[];
    }
    return rejectWithValue(
      'Некорректный ответ API: ожидается массив ингредиентов'
    );
  } catch (e: unknown) {
    try {
      return await fetchIngredientsFallback();
    } catch (fallbackErr: unknown) {
      const msg =
        getMessage(fallbackErr) ||
        getMessage(e) ||
        'Ошибка загрузки ингредиентов';
      return rejectWithValue(msg);
    }
  }
});
