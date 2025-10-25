import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserThunk } from '../../services/users';
import { selectUserLoading } from '../../services/users/users-slice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('khodorov.ivan@gmail.com');
  const [password, setPassword] = useState('12345');
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
  };
  const loading = useSelector(selectUserLoading);
  if (loading) return <Preloader />;

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
