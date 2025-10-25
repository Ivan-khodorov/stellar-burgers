import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
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

  const data = (await res.json()) as { success: boolean; data?: TIngredient[] };
  if (!res.ok || !data?.success || !Array.isArray(data.data)) {
    throw new Error('Некорректный формат: нет массива data');
  }
  return data.data!;
}

export const getIngredientsThunk = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const list = await getIngredientsApi();
    if (Array.isArray(list)) return list;
    return rejectWithValue(
      'Некорректный ответ API: ожидается массив ингредиентов'
    );
  } catch (e: any) {
    try {
      return await fetchIngredientsFallback();
    } catch (fallbackErr: any) {
      const msg =
        fallbackErr?.message || e?.message || 'Ошибка загрузки ингредиентов';
      return rejectWithValue(msg);
    }
  }
});
