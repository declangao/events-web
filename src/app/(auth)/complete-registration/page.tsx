'use client';

import { AuthForm, AuthFormType } from '@/components/auth-form';
import { CREATE_USER } from '@/graphql/mutations';
import { auth } from '@/lib/firebase';
import { AuthPayload } from '@/schemas/auth-form';
import { AuthContext } from '@/store/auth';
import { useMutation } from '@apollo/client';
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const CompleteRegistrationPage = () => {
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState('');

  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [createUser] = useMutation(CREATE_USER);

  // Wrap in useEffect to avoid window not defined error
  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForSignIn') ?? '');
  }, []);

  const handleSubmit = async (data: AuthPayload) => {
    setIsPending(true);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (!email) {
        toast.error(
          'Please open the link on the same device you registered with.'
        );
        setIsPending(false);
        return;
      }

      try {
        const result = await signInWithEmailLink(
          auth,
          email!,
          window.location.href
        );
        console.log(result);
        if (result?.user?.emailVerified) {
          window.localStorage.removeItem('emailForSignIn');

          const user = auth.currentUser!;
          await updatePassword(user, data.password!);

          // update state
          const idTokenResult = await user.getIdTokenResult();
          authCtx.setUser({
            email: user.email!,
            token: idTokenResult.token,
          });

          console.log('before create');
          // create use in own database
          await createUser();

          router.push('/');
          toast.success('Registration completed!');
        } else {
          toast.error('Failed to verify your email. Please try again.');
        }
      } catch (error) {
        toast.error('Registration failed!', {
          description: (error as Error).message,
        });
      } finally {
        setIsPending(false);
      }
    } else {
      toast.error('Email verification failed. Please try again.');
      setIsPending(false);
    }
  };

  return (
    <div className="h-[calc(100vh_-_4rem)] flex items-center justify-center">
      <AuthForm
        type={AuthFormType.CompleteRegistration}
        isPending={isPending}
        onSubmit={handleSubmit}
        confirmationEmail={email ?? ''}
      />
    </div>
  );
};

export default CompleteRegistrationPage;
