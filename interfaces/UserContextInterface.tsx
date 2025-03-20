import { FormEvent } from 'react';

interface UserContextInterface {
  user: {
    id: string;
    name?: string;
    resume?: string;
    openai_key?: string;
    firecrawl_key?: string;
  };
  login?: (e: FormEvent<HTMLFormElement>) => void;
  logout?: () => void;
}
export default UserContextInterface;
