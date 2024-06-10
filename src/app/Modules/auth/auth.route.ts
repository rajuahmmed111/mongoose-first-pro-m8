import { Router } from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { authControllers } from './auth.controller';
import { loginValidation } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(loginValidation.createLoginValidationSchema),
  authControllers.loginUser,
);

export const authRoutes = router;
