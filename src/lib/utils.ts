import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.7 },
  });
};
