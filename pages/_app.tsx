import { UserContext } from '@/contexts/UserContext';
import { fetchUser, fetchUserLogin } from '@/functions/functions';
import '@/styles/globals.css';
import { addToast, HeroUIProvider, ToastProvider } from '@heroui/react';
import type { AppProps } from 'next/app';
import { FormEvent, useCallback, useEffect, useState } from 'react';
export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<UserContext>();
  const fetchMyUser = useCallback(async (args: { token: string }) => {
    const { token } = args;
    const userData = await fetchUser({ token });
    setUser(userData);
  }, []);
  useEffect(function checkForUser() {
    const token = window.localStorage.getItem('token');
    if (token) {
      //TODO add check to token expiry?
      fetchMyUser({ token });
    } else {
      setUser(undefined);
    }
  }, []);
  const logout = () => {
    setUser(undefined);
  };
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = Object.fromEntries(formData).email.toString();
    const password = Object.fromEntries(formData).password.toString();
    await fetchUserLogin({ email, password })
      .then((data) => {
        const userId = {
          id: data,
        };
        return setUser(userId);
      })
      .catch((e) => {
        addToast({
          color: 'danger',
          title: `There was an error logging in, ${e}`,
        });
        return;
      });
  };
  const userContextValue = {
    id: user && user.id,
    resume: user && user.resume,
    openai_key: user && user.openai_key,
    firecrawl_key: user && user.firecrawl_key,
    login: login,
    logout: logout,
  };
  return (
    <UserContext.Provider value={userContextValue}>
      <HeroUIProvider className='dark'>
        <ToastProvider placement='top-center' />
        <Component {...pageProps} />
      </HeroUIProvider>
    </UserContext.Provider>
  );
}
