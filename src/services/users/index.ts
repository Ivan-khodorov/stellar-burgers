import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (newUserData: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(newUserData);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Ошибка регистрации');
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(loginData);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Ошибка входа');
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (userPartialData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(userPartialData);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Ошибка изменения данных');
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Ошибка выхода');
    }
  }
);

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('user/checkUserAuth', async (_, { rejectWithValue }) => {
  try {
    if (!getCookie('accessToken')) {
      return null;
    }

    const resp = await getUserApi();

    const userData =
      (resp as any)?.user ??
      (resp as any)?.data?.user ??
      (resp as any)?.data ??
      resp;

    if (!userData) return null;

    return userData as TUser;
  } catch (err: any) {
    const msg = err?.message || 'Ошибка проверки авторизации';
    return rejectWithValue(msg);
  }
});

export const setIsAuthChecked = createAction<boolean, 'user/setIsAuthChecked'>(
  'user/setIsAuthChecked'
);
