import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  checkUserAuth,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  setIsAuthChecked,
  updateUserThunk
} from './index';

export interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      setIsAuthChecked,
      (state, action: PayloadAction<boolean>) => {
        state.isAuthChecked = action.payload;
      }
    );

    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkUserAuth.fulfilled,
        (state, action: PayloadAction<TUser | null>) => {
          state.loading = false;
          state.user = action.payload ?? null;
          state.isAuthChecked = true;
        }
      )
      .addCase(
        checkUserAuth.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка авторизации';
          state.user = null;
          state.isAuthChecked = true;
        }
      );

    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addCase(
        registerUserThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка регистрации';
        }
      );
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addCase(
        loginUserThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка входа';
        }
      );

    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(
        updateUserThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка изменения данных';
        }
      );

    builder
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null; // токены очищаются в thunk
      })
      .addCase(
        logoutUserThunk.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? 'Ошибка выхода';
        }
      );
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError
} = userSlice.selectors;

export const { setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
