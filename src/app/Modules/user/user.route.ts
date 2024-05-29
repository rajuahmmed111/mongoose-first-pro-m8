import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { studentValidation } from '../student/student.zod.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

// validation

router.post(
  '/create-student',
  validateRequest(studentValidation.createStudentValidationSchema),
  UserControllers.createStudent,
);

export const UsersRoutes = router;
