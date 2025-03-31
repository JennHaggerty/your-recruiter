import { createContext, FormEvent, useContext } from 'react';
export interface UserContextInterface {
  user_id?: string;
  email?: string;
  resume?: string;
  openai_key?: string;
  firecrawl_key?: string;
  login?: (e: FormEvent<HTMLFormElement>) => void;
  logout?: () => void;
  signup?: (e: FormEvent<HTMLFormElement>) => void;
}
export const UserContext = createContext<UserContextInterface>({
  user_id: '',
  email: '',
  resume: '',
  openai_key: '',
  firecrawl_key: '',
  login: () => {},
  logout: () => {},
  signup: () => {},
});
export const useUserContext = () => useContext(UserContext);
