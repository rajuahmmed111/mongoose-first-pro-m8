import { z } from 'zod';

const createLoginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changeValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old is required' }),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookie: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
  }),
});

export const loginValidation = {
  createLoginValidationSchema,
  changeValidationSchema,
  refreshTokenValidationSchema,
};
