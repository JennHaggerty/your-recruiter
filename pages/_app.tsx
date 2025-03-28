import { UserContext } from '@/contexts/UserContext';
import { fetchUser, fetchUserId, fetchUserLogin } from '@/functions/functions';
import '@/styles/globals.css';
import { addToast, HeroUIProvider, ToastProvider } from '@heroui/react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { FormEvent, useCallback, useEffect, useState } from 'react';
export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<UserContext>();
  const fetchMyUser = useCallback(async (args: { token: string }) => {
    const { token } = args;
    await fetchUserId({ token })
      .then(async (id) => {
        const data = await fetchUser({ id })
          .then((data) => {
            return data;
          })
          .catch((e) => {
            addToast({ color: 'danger', title: `Cannot retrieve user, ${e}` });
            return;
          });
        setUser(data);
      })
      .then(() => Router.push('./'))
      .catch((e) => {
        addToast({ color: 'danger', title: `Cannot retrieve user id, ${e}` });
        return;
      });
  }, []);
  useEffect(function checkForUser() {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetchMyUser({ token });
    } else {
      logout();
    }
    return;
  }, []);
  const logout = () => {
    window.localStorage.removeItem('token');
    setUser(undefined);
    Router.push('./welcome');
  };
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = Object.fromEntries(formData).email.toString();
    const password = Object.fromEntries(formData).password.toString();
    await fetchUserLogin({ email, password })
      .then((res) => {
        if (res === 'success') Router.reload();
      })
      .catch((e) => {
        return addToast({
          color: 'danger',
          title: `There was an error logging in, ${e}`,
        });
      });
  };
  const userContextValue = {
    user_id: user && user.user_id,
    resume: user && user.resume,
    email: user && user.email,
    openai_key: user && user.openai_key,
    firecrawl_key: user && user.firecrawl_key,
    login: login,
    logout: logout,
  };
  return (
    <HeroUIProvider className='dark'>
      <ToastProvider placement='top-center' />
      <UserContext.Provider value={userContextValue}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </HeroUIProvider>
  );
}
