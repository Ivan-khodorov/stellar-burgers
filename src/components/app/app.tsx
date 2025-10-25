import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../check_road/check_road';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/users';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/ingredients/ingredients-slice';
import { getIngredientsThunk } from '../../services/ingredients';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const onCloseModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredientsThunk());
    }
  }, [dispatch, ingredients.length]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <PrivateRoute>
              <ProfileOrders />
            </PrivateRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <PrivateRoute>
              <OrderInfo />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={onCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={onCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <PrivateRoute>
                <Modal title={''} onClose={onCloseModal}>
                  <OrderInfo />
                </Modal>
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
