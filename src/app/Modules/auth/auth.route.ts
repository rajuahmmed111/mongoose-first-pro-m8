import { Router } from 'express';
import auth from '../../Middleware/auth';
import validateRequest from '../../Middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { authControllers } from './auth.controller';
import { loginValidation } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(loginValidation.createLoginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.student),
  validateRequest(loginValidation.changeValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(loginValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(loginValidation.forgetPasswordValidationSchema),
  authControllers.forgetPassword,
);

export const authRoutes = router;
