import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z
    .string()
    .min(5, 'Name must be at least 5 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 500 characters'),
  location: z
    .string()
    .min(5, 'Location must be at least 5 characters')
    .max(100, 'Location must be less than 50 characters'),
  // datetime: z.string().datetime('Invalid date and time format'),
  // datetime: z.string(),
  date: z.string().date(),
  // time: z.string().time(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time'),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string() }))
    .optional(),
});

export type EventFormPayload = z.infer<typeof eventFormSchema>;
