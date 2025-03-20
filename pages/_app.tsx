import userContext, { emptyUserState } from '@/contexts/UserContext';
import { fetchUser, fetchUserLogin } from '@/functions/functions';
import UserContextInterface from '@/interfaces/UserContextInterface';
import '@/styles/globals.css';
import { addToast, HeroUIProvider, ToastProvider } from '@heroui/react';
import type { AppProps } from 'next/app';
import { FormEvent, useCallback, useEffect, useState } from 'react';
export default function App({ Component, pageProps }: AppProps) {
  const [userState, setUserState] =
    useState<UserContextInterface>(emptyUserState);
  const fetchMyUser = useCallback(async (args: { token: string }) => {
    const { token } = args;
    const user = await fetchUser({ token });
    setUserState({ user: user });
  }, []);
  useEffect(function checkForUser() {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetchMyUser({ token });
    } else {
      setUserState(emptyUserState);
    }
  }, []);
  if (!userState) return;
  const logout = () => {
    setUserState(emptyUserState);
  };
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = Object.fromEntries(formData).email.toString();
    const password = Object.fromEntries(formData).password.toString();
    await fetchUserLogin({ email, password })
      .then((data) => (userState.user.id = data))
      .catch((e) =>
        addToast({
          color: 'danger',
          title: `There was an error logging in, ${e}`,
        })
      );
  };
  const userContextValue = {
    user: {
      id: userState.user.id,
      name: userState.user.name,
      resume: userState.user.resume,
      openai_key: userState.user.openai_key,
      firecrawl_key: userState.user.firecrawl_key,
    },
    login: login,
    logout: logout,
  };
  return (
    <userContext.Provider value={userContextValue}>
      <HeroUIProvider className='dark'>
        <ToastProvider placement='top-center' />
        <Component {...pageProps} />
      </HeroUIProvider>
    </userContext.Provider>
  );
}
