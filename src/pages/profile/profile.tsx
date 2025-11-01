import { useDispatch, useSelector } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { FC, FormEvent, ChangeEvent, useEffect, useState } from 'react';
import { TRegisterData } from '@api';
import { updateUserThunk } from '../../services/users';
import { selectUser } from '../../services/users/users-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  if (!user) return null;

  const [formValue, setFormValue] = useState<Partial<TRegisterData>>({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateUserThunk(formValue));
  };
  const handleCancel = () => {
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={{
        name: formValue.name || '',
        email: formValue.email || '',
        password: formValue.password || ''
      }}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
