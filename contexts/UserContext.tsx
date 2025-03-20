import UserContextInterface from '@/interfaces/UserContextInterface';
import { createContext } from 'react';
export const emptyUserState = {
  user: { id: '' },
};
const userContext = createContext<UserContextInterface>(emptyUserState);
export default userContext;
