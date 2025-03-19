import { FormEvent } from 'react';

interface UserStateInterface {
  state: {
    _id: string;
    resume?: string;
  };
  login?: (e: FormEvent<HTMLFormElement>) => void;
  logout?: () => void;
}
export default UserStateInterface;
