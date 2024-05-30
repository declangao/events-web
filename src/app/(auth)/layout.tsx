'use client';

import { AuthContext } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useContext, useEffect } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authCtx.user) {
      router.replace('/');
    }
  }, [authCtx.user, router]);

  return <div className="container">{children}</div>;
};

export default AuthLayout;
