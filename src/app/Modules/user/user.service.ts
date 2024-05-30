import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../Error/Apperror';
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

  userData.password = password || (config.default_pass as string);

  // set student role
  userData.role = 'student';

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set generate id
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    );

    // create user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to create user');
    }

    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id; // reference _id

    // create a student(transaction-2)
    const newStudent = await Student.create([payLoad], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
  }
};

export const UserServices = {
  createStudentDB,
};
