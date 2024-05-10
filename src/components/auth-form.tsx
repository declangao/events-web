'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export enum AuthFormType {
  Login,
  Register,
  CompleteRegistration,
  ResetPassword,
}

type Props = {
  type: AuthFormType;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function AuthForm({ type, isPending, onSubmit }: Props) {
  return (
    <Card className="mx-auto max-w-md min-w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">
          {type === AuthFormType.Login && 'Login'}
          {type === AuthFormType.Register && 'Register'}
          {type === AuthFormType.CompleteRegistration &&
            'Complete Registration'}
          {type === AuthFormType.ResetPassword && 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {type === AuthFormType.Login &&
            'Enter your credentials to login to your account'}
          {type === AuthFormType.Register &&
            'Enter your email to create an account'}
          {type === AuthFormType.CompleteRegistration &&
            'Set a password for your account'}
          {type === AuthFormType.ResetPassword &&
            'Enter your email to reset your password'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          {type !== AuthFormType.CompleteRegistration && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                disabled={isPending}
                required
              />
            </div>
          )}

          {type !== AuthFormType.Register &&
            type !== AuthFormType.ResetPassword && (
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {type !== AuthFormType.CompleteRegistration && (
                    <Link
                      href="/reset-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isPending}
                  required
                />
              </div>
            )}

          <Button type="submit" disabled={isPending} className="w-full">
            {type === AuthFormType.Login && 'Login'}
            {type === AuthFormType.Register && 'Register'}
            {(type === AuthFormType.CompleteRegistration ||
              type === AuthFormType.ResetPassword) &&
              'Proceed'}
            {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>

          {type !== AuthFormType.CompleteRegistration &&
            type !== AuthFormType.ResetPassword && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-2"
              >
                <svg
                  height="100%"
                  viewBox="0 0 20 20"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Login with Google
              </Button>
            )}
        </form>

        {type === AuthFormType.Register && (
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        )}

        {(type === AuthFormType.Login ||
          type === AuthFormType.ResetPassword) && (
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
