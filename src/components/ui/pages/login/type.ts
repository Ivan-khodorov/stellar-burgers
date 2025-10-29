import { FormEvent } from 'react';

export type LoginUIProps = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  errorText?: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};
