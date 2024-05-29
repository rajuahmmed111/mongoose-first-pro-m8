import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Academic department is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Academic Faculty is required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Academic department is required',
    })
    .optional(),
  academicFaculty: z
    .string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Academic Faculty is required',
    })
    .optional(),
});

export const academicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
