import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  checkUserAuth,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  setIsAuthChecked,
  updateUserThunk
} from './index';
import { setCookie } from '../../utils/cookie';

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
    setUser: (state, action) => {
      state.user = (action.payload as TUser) ?? null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setIsAuthChecked, (state, action) => {
      state.isAuthChecked = action.payload;
    });
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = (action.payload as TUser | null) ?? null;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Ошибка авторизации';
        state.user = null;
        state.isAuthChecked = true;
      });
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        setCookie('accessToken', '', { expires: -1 });
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.loading
  }
});

export const { selectUser, selectIsAuthChecked, selectUserLoading } =
  userSlice.selectors;

export const { setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
