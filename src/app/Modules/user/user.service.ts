import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { Student } from '../student.model';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utiles';

const createStudentDB = async (password: string, payLoad: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, set default password
  // if (!password) {
  //   user.password = config.default_pass as string;
  // } else {
  //   user.password = password;
  // }
  // or
  userData.password = password || (config.default_pass as string);

  // set student role
  userData.role = 'student';

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  // set generate id
  userData.id = await generateStudentId(admissionSemester as TAcademicSemester);

  // create user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    payLoad.id = newUser.id;
    payLoad.user = newUser._id; // reference _id
  }

  const newStudent = await Student.create(payLoad);
  return newStudent;
};

export const UserServices = {
  createStudentDB,
};
