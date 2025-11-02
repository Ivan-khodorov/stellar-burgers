import { userSlice, setUser } from '../users/users-slice';
import {
  checkUserAuth,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserThunk,
  setIsAuthChecked
} from '../users';
import type { TUser } from '@utils-types';

const reducer = userSlice.reducer;

const user: TUser = {
  email: 'tester@cypress.io',
  name: 'Cypress Tester'
};

describe('usersSlice', () => {
  it('setUser: задаёт пользователя', () => {
    const state = reducer(undefined, setUser(user));
    expect(state.user?.email).toBe('tester@cypress.io');
  });

  it('setIsAuthChecked: выставляет флаг проверки', () => {
    const state = reducer(undefined, setIsAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('checkUserAuth pending/fulfilled(null|user)/rejected', () => {
    let s = reducer(undefined, { type: checkUserAuth.pending.type });
    expect(s.loading).toBe(true);

    s = reducer(undefined, {
      type: checkUserAuth.fulfilled.type,
      payload: null
    });
    expect(s.loading).toBe(false);
    expect(s.user).toBeNull();
    expect(s.isAuthChecked).toBe(true);

    s = reducer(undefined, {
      type: checkUserAuth.fulfilled.type,
      payload: user
    });
    expect(s.loading).toBe(false);
    expect(s.user?.name).toBe('Cypress Tester');
    expect(s.isAuthChecked).toBe(true);

    s = reducer(undefined, {
      type: checkUserAuth.rejected.type,
      payload: 'err'
    });
    expect(s.loading).toBe(false);
    expect(s.error).toBe('err');
    expect(s.user).toBeNull();
    expect(s.isAuthChecked).toBe(true);
  });

  it('loginUserThunk pending/fulfilled/rejected', () => {
    let s = reducer(undefined, { type: loginUserThunk.pending.type });
    expect(s.loading).toBe(true);

    s = reducer(undefined, {
      type: loginUserThunk.fulfilled.type,
      payload: user
    });
    expect(s.loading).toBe(false);
    expect(s.user?.email).toBe(user.email);
    expect(s.isAuthChecked).toBe(true);

    s = reducer(undefined, {
      type: loginUserThunk.rejected.type,
      payload: 'bad'
    });
    expect(s.loading).toBe(false);
    expect(s.error).toBe('bad');
  });

  it('registerUserThunk pending/fulfilled/rejected', () => {
    let s = reducer(undefined, { type: registerUserThunk.pending.type });
    expect(s.loading).toBe(true);

    s = reducer(undefined, {
      type: registerUserThunk.fulfilled.type,
      payload: user
    });
    expect(s.loading).toBe(false);
    expect(s.user?.name).toBe('Cypress Tester');
    expect(s.isAuthChecked).toBe(true);

    s = reducer(undefined, {
      type: registerUserThunk.rejected.type,
      payload: 'oops'
    });
    expect(s.loading).toBe(false);
    expect(s.error).toBe('oops');
  });

  it('updateUserThunk pending/fulfilled/rejected', () => {
    let s = reducer(undefined, { type: updateUserThunk.pending.type });
    expect(s.loading).toBe(true);

    s = reducer(undefined, {
      type: updateUserThunk.fulfilled.type,
      payload: { ...user, name: 'Updated' }
    });
    expect(s.loading).toBe(false);
    expect(s.user?.name).toBe('Updated');

    s = reducer(undefined, {
      type: updateUserThunk.rejected.type,
      payload: 'fail'
    });
    expect(s.loading).toBe(false);
    expect(s.error).toBe('fail');
  });

  it('logoutUserThunk pending/fulfilled/rejected', () => {
    let s = reducer(undefined, { type: logoutUserThunk.pending.type });
    expect(s.loading).toBe(true);

    s = reducer(undefined, { type: logoutUserThunk.fulfilled.type });
    expect(s.loading).toBe(false);
    expect(s.user).toBeNull();

    s = reducer(undefined, {
      type: logoutUserThunk.rejected.type,
      payload: 'nope'
    });
    expect(s.loading).toBe(false);
    expect(s.error).toBe('nope');
  });
});
