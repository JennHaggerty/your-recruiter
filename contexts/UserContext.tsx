import { createContext, FormEvent, useContext } from 'react';
export interface UserContext {
  user_id?: string;
  resume?: string;
  openai_key?: string;
  firecrawl_key?: string;
  login?: (e: FormEvent<HTMLFormElement>) => void;
  logout?: () => void;
  signup?: (e: FormEvent<HTMLFormElement>) => void;
}
export const UserContext = createContext<UserContext>({
  user_id: '',
  resume: '',
  openai_key: '',
  firecrawl_key: '',
  login: () => {},
  logout: () => {},
  signup: () => {},
});
export const useUserContext = () => useContext(UserContext);
