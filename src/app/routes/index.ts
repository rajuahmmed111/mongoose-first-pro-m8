import { Router } from 'express';
import { semesterRegistrationRoutes } from '../Modules/SemesterRegistration/semesterRegis.route';
import { AcademicDepartmentRoutes } from '../Modules/academicDepartment/academicDept.route';
import { AcademicFacultyRoutes } from '../Modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoutes } from '../Modules/academicSemester/academicSemester.route';
import { AdminRoutes } from '../Modules/admin/admin.route';
import { authRoutes } from '../Modules/auth/auth.route';
import { CourseRoutes } from '../Modules/course/course.route';
import { FacultyRoutes } from '../Modules/faculty/faculty.route';
import { offeredCourseRoutes } from '../Modules/offeredCourse/offeredCourse.route';
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
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
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
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
