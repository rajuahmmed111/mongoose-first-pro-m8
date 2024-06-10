import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { StudentController } from './student.controller';
import { studentValidation } from './student.zod.validation';

const router = express.Router();

// will call controller func
// router.post('/create-student', StudentController.createStudent);

router.get('/', StudentController.getAllStudents);

router.get('/:id', StudentController.getSingleStudent);

router.delete('/:id', StudentController.deletedStudent);

router.patch(
  '/:id',
  validateRequest(studentValidation.updateStudentValidationSchema),
  StudentController.updateStudent,
);

export const StudentRoutes = router;
