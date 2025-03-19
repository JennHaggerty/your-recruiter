import userContext, { emptyUser } from '@/contexts/UserContext';
import { fetchUserLogin } from '@/functions/functions';
import UserStateInterface from '@/interfaces/UserStateInterface';
import '@/styles/globals.css';
import { addToast, HeroUIProvider, ToastProvider } from '@heroui/react';
import type { AppProps } from 'next/app';
import { FormEvent, useEffect, useState } from 'react';
export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<UserStateInterface>();
  useEffect(function checkForUser() {
    if (window.localStorage.getItem('token')) {
      //TODO add token handling
    }
    if (!user) {
      setUser(emptyUser);
    }
  }, []);
  if (!user) return;
  const logout = () => {
    setUser(emptyUser);
  };
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = Object.fromEntries(formData).email.toString();
    const password = Object.fromEntries(formData).password.toString();
    await fetchUserLogin({ email, password })
      .then((data) => (user.state = data))
      .catch((e) =>
        addToast({
          color: 'danger',
          title: `There was an error logging in, ${e}`,
        })
      );
  };
  const userContextValue = {
    state: {
      _id: user.state._id,
      resume: user.state.resume,
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
