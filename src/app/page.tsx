'use client';

import { AuthContext } from '@/store/auth';
import { useContext } from 'react';

export default function Home() {
  const authCtx = useContext(AuthContext);

  return <div className="">{JSON.stringify(authCtx.user)}</div>;
}
