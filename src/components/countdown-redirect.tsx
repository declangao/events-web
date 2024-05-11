'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  path?: string;
  pathName?: string;
  title?: string;
  delay?: number;
};

const CountdownRedirect = ({
  path = '/login',
  pathName = 'login',
  title = 'Please login to view this page',
  delay = 5,
}: Props) => {
  const [countdown, setCountdown] = useState(delay);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push(path);
    }, delay * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [delay, path, router]);

  return (
    <div className="w-full text-center">
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="text-muted-foreground">
        Redirecting to {pathName} page in {countdown} seconds
      </p>
    </div>
  );
};

export default CountdownRedirect;
