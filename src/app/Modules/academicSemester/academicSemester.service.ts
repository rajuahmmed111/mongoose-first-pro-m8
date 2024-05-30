import httpStatus from 'http-status';
import AppError from '../../Error/Apperror';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterBD = async (payLoad: TAcademicSemester) => {
  // semester name--> code

  if (academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester code');
  }
  const result = await AcademicSemester.create(payLoad);
  return result;
};

const getAllAcademicSemesterBD = async (payLoad: TAcademicSemester) => {
  const result = await AcademicSemester.find(payLoad);
  return result;
};

const getSingleAcademicSemesterBD = async (semesterId: string) => {
  const result = await AcademicSemester.findById({ _id: semesterId });
  return result;
};

const updateAcademicSemesterBD = async (
  semesterId: string,
  payLoad: TAcademicSemester,
) => {
  if (
    payLoad.name &&
    payLoad.code &&
    academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester code');
  }
  const result = await AcademicSemester.findOneAndUpdate(
    { _id: semesterId },
    payLoad,
    { new: true },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterBD,
  getAllAcademicSemesterBD,
  getSingleAcademicSemesterBD,
  updateAcademicSemesterBD,
};
