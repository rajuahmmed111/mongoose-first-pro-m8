/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../Error/Apperror';
import config from '../../config';
import { AcademicDepartment } from '../academicDepartment/academicDept.model';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { Admin } from '../admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student.model';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utiles';

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

  // transaction and Rollback
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
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw Error(err);
  }
};
// faculty
const createFacultyDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// admin
const createAdminDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentDB,
  createFacultyDB,
  createAdminDB,
};
