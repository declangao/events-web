'use client';

import { AuthForm, AuthFormType } from '@/components/auth-form';
import { CREATE_USER } from '@/graphql/mutations';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { AuthPayload } from '@/schemas/auth-form';
import { AuthContext } from '@/store/auth';
import { useMutation } from '@apollo/client';
import { sendSignInLinkToEmail, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();
  const authCtx = useContext(AuthContext);

  const [createUser] = useMutation(CREATE_USER);

  const handleSubmit = async (data: AuthPayload) => {
    setIsPending(true);

    try {
      await sendSignInLinkToEmail(auth, data.email!, {
        url: `${window.location.origin}/complete-registration`,
        handleCodeInApp: true,
      });

      window.localStorage.setItem('emailForSignIn', data.email!);

      // router.push('/');
      toast.success('Please check your email to verify your account');
    } catch (error) {
      toast.error('Something went wrong', {
        description: (error as Error).message,
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

      // TODO: Fix calling graphql api without authorisation header
      await new Promise((resolve) => setTimeout(resolve, 500));

      await createUser();

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
        type={AuthFormType.Register}
        isPending={isPending}
        onSubmit={handleSubmit}
        onLoginWithGoogle={handleLoginWithGoogle}
      />
    </div>
  );
};

export default RegisterPage;
