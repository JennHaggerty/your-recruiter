import { emptyUserState } from '@/contexts/UserContext';
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
    console.log(user);
  }, []);
  useEffect(function checkForUser() {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetchMyUser({ token });
    } else {
      // do nothing
    }
  }, []);
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
  return (
    <HeroUIProvider className='dark'>
      <ToastProvider placement='top-center' />
      <Component {...pageProps} />
    </HeroUIProvider>
  );
}
