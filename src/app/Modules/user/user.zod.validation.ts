import { z } from 'zod';

const userZodSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .max(20, { message: 'not char <20' })
    .optional(),
});

export const UserValidation = {
  userZodSchema,
};
