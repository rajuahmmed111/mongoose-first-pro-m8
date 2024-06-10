// import mongoose from 'mongoose';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../Error/Apperror';
import QueryBuilder from '../../builder/queryBuilder';
import { Student } from '../student.model';
import { User } from '../user/user.model';
import { studentSearchableFields } from './student.constant';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // { email: {$regex: query?.searchTerm, $options: i}}
  // const queryObj = { ...query }; // copy
  // const studentSearchableFields = [
  //   'email',
  //   'name.middleName',
  //   'presentAddress',
  // ];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // const excludeFields = [
  //   'searchTerm',
  //   'sort',
  //   'page',
  //   'skip',
  //   'limit',
  //   'fields',
  // ];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // console.log({ query }, { queryObj });
  // const filterQuery = searchQuery
  //   .find(queryObj)
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // })
  //   .populate('admissionSemester');
  //filtering
  // let sort = '-createdAt';
  // if (query?.sort) {
  //   sort = query?.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);
  // let limit = 1;
  // let page = 1;
  // let skip = 0;
  // if (query?.limit) {
  //   limit = Number(query?.limit);
  // }
  // if (query?.page) {
  //   page = Number(query?.page);
  //   skip = (page - 1) * limit;
  // }
  // const pagination = sortQuery.skip(skip);
  // const limitQuery = pagination.limit(limit);
  // field limiting
  // let fields = '-__v';
  // // fields= name,email
  // // convert fields= (name email)
  // if (query?.fields) {
  //   fields = (query?.fields as string).split(',').join(' ');
  //   console.log({ fields });
  // }
  // const fieldsQuery = await limitQuery.select(fields);
  // return fieldsQuery;

  // class system a query
  const studentQuery = new QueryBuilder(
    Student.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
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
  /*
  guardian: {
    fatherOccupation: "Teacher"
  }
  ---> transform---->

  guardian.fatherOccupation =  "Teacher"
  */

  const result = await Student.findByIdAndUpdate(id, modifiedUpdateData, {
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
    const deleteStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'fail to delete student ');
    }

    const userId = deleteStudent.user;

    // delete user (transaction-2)

    const deleteUser = await User.findByIdAndUpdate(
      userId,
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
