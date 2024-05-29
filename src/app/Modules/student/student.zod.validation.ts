import { z } from 'zod';

// Define Zod schema for UserName
const userNameValidationZodSchema = z.object({
  firstName: z
    .string()
    .max(20, 'first Name can not maxLength allow more then 20')
    .trim(),
  middleName: z
    .string()
    .max(20, 'middle Name can not maxLength allow more then 20')
    .trim()
    .refine(
      (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() === value,
      { message: 'Middle name is not in capitalize format' },
    ),
  lastName: z.string().refine((value) => /^[A-Za-z]+$/.test(value), {
    message: '{VALUE} is not valid',
  }),
});

// Define Zod schema for Guardian
const guardianValidationZodSchema = z.object({
  fatherName: z.string().nonempty('father name is required'),
  fatherOccupation: z.string().nonempty('father Occupation is required'),
  fatherContactNo: z.string().nonempty('father contact is required'),
  motherName: z.string().nonempty('mother name is required'),
  motherOccupation: z.string().nonempty('mother Occupation is required'),
  motherContactNo: z.string().nonempty('mother contact is required'),
});

// Define Zod schema for LocalGuardian
const localGuardianValidationZodSchema = z.object({
  name: z.string().nonempty('localGuardianSchema name is required'),
  occupation: z.string().nonempty('localGuardianSchema occupation is required'),
  contactNo: z.string().nonempty('localGuardianSchema contact is required'),
  address: z.string().nonempty('address is required'),
});

// Define Zod schema for Student
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).nonempty('password is required'),
    student: z.object({
      name: userNameValidationZodSchema,
      gender: z.enum(['male', 'female', 'others'], {
        errorMap: () => ({ message: '{VALUE} is not valid' }),
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .nonempty('email is required')
        .email('{VALUE} is not valid email type'),
      contactNo: z.string().nonempty('contactNo is required'),
      emergencyContactNo: z.string().nonempty('emergencyContactNo is required'),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().nonempty('presentAddress is required'),
      permanentAddress: z.string().nonempty('permanentAddress is required'),
      guardian: guardianValidationZodSchema,
      localGuardian: localGuardianValidationZodSchema,
      admissionSemester: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidation = {
  createStudentValidationSchema,
};
