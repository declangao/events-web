import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
});

export type AuthPayload = z.infer<typeof authSchema>;

// export const EmailSchema = z.object({
//   email: z.string().email(),
// });

// export const PasswordSchema = z.object({
//   password: z.string().min(6),
// });

// export const EmailPasswordSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// export type EmailPayload = z.infer<typeof EmailSchema>;
// export type PasswordPayload = z.infer<typeof PasswordSchema>;
// export type EmailPasswordPayload = z.infer<typeof EmailPasswordSchema>;
