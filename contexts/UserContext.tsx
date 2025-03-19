import UserStateInterface from '@/interfaces/UserStateInterface';
import { createContext } from 'react';
export const emptyUser = {
  state: { _id: '' },
};
const userContext = createContext<UserStateInterface>(emptyUser);
export default userContext;
