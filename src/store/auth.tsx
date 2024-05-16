'use client';

import { auth } from '@/lib/firebase';
import { deleteCookie, setCookie } from 'cookies-next';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

type User = {
  email: string;
  token: string;
};

export type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthState>({
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //   if (user) {
    //     const idTokenResult = await user.getIdTokenResult();

    //     setUser({
    //       email: user.email!,
    //       token: idTokenResult.token,
    //     });

    //     setCookie('token', idTokenResult.token, {
    //       path: '/',
    //     });
    //   } else {
    //     setUser(null);
    //     deleteCookie('token');
    //   }
    // });

    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        setUser({
          email: user.email!,
          token: idTokenResult.token,
        });

        setCookie('token', idTokenResult.token, {
          path: '/',
        });
      } else {
        setUser(null);
        deleteCookie('token');
      }
    });

    // force refresh the token every 10 minutes
    const timer = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
