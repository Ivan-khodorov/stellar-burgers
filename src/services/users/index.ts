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
import { getCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type MaybeData<T> = T | { data: T };

const unwrap = <T>(x: MaybeData<T>): T =>
  x && typeof x === 'object' && 'data' in x
    ? (x as { data: T }).data
    : (x as T);

const getMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e ?? 'Неизвестная ошибка');

type UserEnvelope =
  | { success?: boolean; user?: unknown }
  | { success?: boolean; data?: { user?: unknown } };

const unwrapUser = (x: unknown): TUser | null => {
  if (!x || typeof x !== 'object') return null;

  const env = x as UserEnvelope;

  if ('user' in env && env.user && typeof env.user === 'object') {
    return env.user as TUser;
  }

  if ('data' in env && env.data && typeof env.data === 'object') {
    const d = env.data as { user?: unknown };
    if (d.user && typeof d.user === 'object') return d.user as TUser;
  }

  return null;
};

export const registerUserThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (newUserData, { rejectWithValue }) => {
  try {
    const resp = await registerUserApi(newUserData);
    if (!resp?.success) return rejectWithValue('Ошибка регистрации');

    setCookie('accessToken', resp.accessToken);
    localStorage.setItem('refreshToken', resp.refreshToken);

    return resp.user as TUser;
  } catch (e: unknown) {
    return rejectWithValue(getMessage(e) || 'Ошибка регистрации');
  }
});

export const loginUserThunk = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (loginData, { rejectWithValue }) => {
  try {
    const resp = await loginUserApi(loginData);
    if (!resp?.success) return rejectWithValue('Ошибка входа');

    setCookie('accessToken', resp.accessToken);
    localStorage.setItem('refreshToken', resp.refreshToken);

    return resp.user as TUser;
  } catch (e: unknown) {
    return rejectWithValue(getMessage(e) || 'Ошибка входа');
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userPartialData, { rejectWithValue }) => {
  try {
    const resp = await updateUserApi(userPartialData);
    if (!resp?.success) return rejectWithValue('Ошибка изменения данных');
    return resp.user as TUser;
  } catch (e: unknown) {
    return rejectWithValue(getMessage(e) || 'Ошибка изменения данных');
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    const resp = await logoutApi();
    if (!resp?.success) return rejectWithValue('Ошибка выхода');

    setCookie('accessToken', '', { expires: -1 });
    localStorage.removeItem('refreshToken');
  } catch (e: unknown) {
    return rejectWithValue(getMessage(e) || 'Ошибка выхода');
  }
});

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
    return unwrapUser(unwrap<UserEnvelope>(resp as MaybeData<UserEnvelope>));
  } catch (e: unknown) {
    return rejectWithValue(getMessage(e) || 'Ошибка проверки авторизации');
  }
});

export const setIsAuthChecked = createAction<boolean, 'user/setIsAuthChecked'>(
  'user/setIsAuthChecked'
);
