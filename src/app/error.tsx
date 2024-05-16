'use client';

import { Button } from '@/components/ui/button';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => {
  return (
    <div className="h-[calc(100vh_-_4rem)] flex flex-col gap-4 items-center justify-center">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
};

export default ErrorPage;
