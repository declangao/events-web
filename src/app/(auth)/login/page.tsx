'use client';

import { AuthForm, AuthFormType } from '@/components/auth-form';
import { CREATE_USER } from '@/graphql/mutations';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { AuthPayload } from '@/schemas/auth-form';
import { AuthContext } from '@/store/auth';
import { useMutation } from '@apollo/client';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const LoginPage = () => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();
  const authCtx = useContext(AuthContext);

  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    const createUserInDB = async () => {
      try {
        await createUser();
      } catch (error) {
        console.log((error as Error).message);
      }
    };

    if (authCtx.user) {
      createUserInDB();
    }
  }, [authCtx.user, createUser]);

  const handleSubmit = async (data: AuthPayload) => {
    setIsPending(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email!,
        data.password!
      );

      const user = result.user;
      const idTokenResult = await user.getIdTokenResult();

      authCtx.setUser({
        email: user.email!,
        token: idTokenResult.token,
      });

      router.push('/');
      toast.success('Login successful');
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Error logging in.', {
        description: 'Please checn your credentials and try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      authCtx.setUser({
        email: user.email!,
        token: idTokenResult.token,
      });

      router.push('/');
      toast.success('Login successful');
    } catch (error) {
      console.log((error as Error).message);
      toast.error('Login with Google failed.', {
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="h-[calc(100vh_-_4rem)] flex items-center justify-center">
      <AuthForm
        type={AuthFormType.Login}
        isPending={isPending}
        onSubmit={handleSubmit}
        onLoginWithGoogle={handleLoginWithGoogle}
      />
    </div>
  );
};

export default LoginPage;
