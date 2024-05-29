import { TAcademicDepartment } from './academicDept.interface';
import { AcademicDepartment } from './academicDept.model';

const createAcademicDepartmentDB = async (payLoad: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payLoad);
  return result;
};

const getAllAcademicDepartmentsFromDB = async (
  payLoad: TAcademicDepartment,
) => {
  const result = await AcademicDepartment.find(payLoad);
  return result;
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id);
  return result;
};

const updateAcademicDepartmentDB = async (
  id: string,
  payLoad: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payLoad,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentService = {
  createAcademicDepartmentDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentDB,
};
