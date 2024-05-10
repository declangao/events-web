'use client';

import { AuthForm, AuthFormType } from '@/components/auth-form';
import { useState } from 'react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    await new Promise((r) => setTimeout(r, 2000));
    setIsPending(false);

    toast.success('Please check your email to verify your account');
  };

  return (
    <div className="h-[calc(100vh_-_4rem)] flex items-center justify-center">
      <AuthForm
        type={AuthFormType.Register}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RegisterPage;
