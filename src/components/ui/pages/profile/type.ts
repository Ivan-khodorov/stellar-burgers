import { ChangeEvent, FormEvent, MouseEvent } from 'react';

export type ProfileUIProps = {
  formValue: { name: string; email: string; password: string };
  isFormChanged: boolean;
  updateUserError?: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleCancel: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
