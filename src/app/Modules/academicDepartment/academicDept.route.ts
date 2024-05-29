import { Router } from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicDepartmentControllers } from './academicDept.controller';
import { academicDepartmentValidations } from './academicDept.validation';

const router = Router();

router.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  validateRequest(
    academicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
