'use client';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorPage;
