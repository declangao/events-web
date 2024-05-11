'use client';

import { AuthForm, AuthFormType } from '@/components/auth-form';
import { auth } from '@/lib/firebase';
import { AuthPayload } from '@/schemas/auth-form';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const ResetPasswordPage = () => {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleSubmit = async (data: AuthPayload) => {
    setIsPending(true);

    try {
      await sendPasswordResetEmail(auth, data.email!, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      });

      router.push('/login');
      toast.success('Password reset email sent!', {
        description: 'Check your email to reset your password.',
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="h-[calc(100vh_-_4rem)] flex items-center justify-center">
      <AuthForm
        type={AuthFormType.ResetPassword}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ResetPasswordPage;
