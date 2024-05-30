// import mongoose from 'mongoose';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../Error/Apperror';
import { Student } from '../student.model';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
    .populate('admissionSemester');
  return result;
};

const getSingleStudentsFromDB = async (id: string) => {
  const result = await Student.findById({ _id: id }) // class  a custom is use korese -----> ata use korle findOne ---> mongoose _id hole findById
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
    .populate('admissionSemester');

  // const ObjectId = mongoose.Types.ObjectId;
  // const result = await Student.aggregate([
  //   { $match: { _id: new ObjectId(id) } },
  // ]);
  return result;
};

const updateStudentsFromDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [keys, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${keys}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [keys, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${keys}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [keys, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${keys}`] = value;
    }
  }
  console.log(modifiedUpdateData);
  /*
  guardian: {
    fatherOccupation: "Teacher"
  }
  ---> transform---->

  guardian.fatherOccupation =  "Teacher"
  */

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deletedStudentsFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // delete student (transaction-1)
    const deleteStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to delete student ');
    }

    // delete user (transaction-2)

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deletedStudentsFromDB,
  updateStudentsFromDB,
};
