import { z } from 'zod';

export const profileFormSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(15),
  about: z.string().max(500).nullable(),
  image: z.object({ url: z.string().url(), publicId: z.string() }).nullable(),
});

export type profileFormPayload = z.infer<typeof profileFormSchema>;
