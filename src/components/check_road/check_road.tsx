import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/users/users-slice';
import { Preloader } from '@ui';

export const PrivateRoute = ({
  children
}: {
  children: React.ReactElement;
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (user) return children;

  return <Navigate to='/login' state={{ from: location }} replace />;
};

export const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (user) {
    const target = (location.state as any)?.from?.pathname ?? '/';
    return <Navigate to={target} replace />;
  }

  return children;
};
