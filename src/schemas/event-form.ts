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
  date: z.string().date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time'),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string() }))
    .default([]),
  location: z
    .string()
    .min(5, 'Location must be at least 5 characters')
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
});

export type EventFormPayload = z.infer<typeof eventFormSchema>;
