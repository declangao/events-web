'use client';

// import { create } from 'zustand';

import { auth } from '@/lib/firebase';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

type User = {
  email: string;
  token: string;
};

export type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   setUser: (user: User) => set({ user }),
// }));

export const AuthContext = createContext<AuthState>({
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        setUser({
          email: user.email!,
          token: idTokenResult.token,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
