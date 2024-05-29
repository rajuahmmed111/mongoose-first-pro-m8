import { Router } from 'express';
import { AcademicDepartmentRoutes } from '../Modules/academicDepartment/academicDept.route';
import { AcademicFacultyRoutes } from '../Modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoutes } from '../Modules/academicSemester/academicSemester.route';
import { StudentRoutes } from '../Modules/student/student.router';
import { UsersRoutes } from '../Modules/user/user.route';

const router = Router();

const moduleRoute = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UsersRoutes,
  },
  {
    path: '/users',
    route: UsersRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
