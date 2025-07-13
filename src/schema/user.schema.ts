import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      firstName: z.string().nonempty('First name is required'),
      lastName: z.string().nonempty('Last name is required'),
      password: z
        .string()
        .nonempty('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      passwordConfirmation: z
        .string()
        .nonempty('Password confirmation is required'),
      email: z
        .string()
        .nonempty('Email is required')
        .pipe(z.email({ message: 'Invalid email' })),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});

export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string(),
    verificationCode: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .nonempty('Email is required')
      .pipe(z.email({ message: 'Invalid email' })),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: z
    .object({
      password: z
        .string()
        .nonempty('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      passwordConfirmation: z
        .string()
        .nonempty('Password confirmation is required'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];

export type VerifyUserInput = z.infer<typeof verifyUserSchema>['params'];

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
