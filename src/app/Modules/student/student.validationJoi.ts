import Joi from 'joi';

// create a schema validation using joi
const userNameSchema = Joi.object({
  firstName: Joi.string().max(20).trim().required().messages({
    'string.max': 'first Name cannot be more than 20 characters',
    'any.required': 'first Name is required',
  }),
  middleName: Joi.string()
    .max(20)
    .trim()
    .required()
    .custom((value, helpers) => {
      const middleNameStr =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      if (middleNameStr !== value) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Capitalize Check')
    .messages({
      'string.max': 'middle Name cannot be more than 20 characters',
      'any.required': 'middle Name is required',
      'any.invalid': '{#label} is not in capitalize format',
    }),
  lastName: Joi.string()
    .required()
    .pattern(/^[A-Za-z]+$/)
    .messages({
      'any.required': 'last Name is required',
      'string.pattern.base': '{#value} is not valid',
    }),
});

// Define Joi schema for Guardian
const guardianSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'any.required': 'father name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'any.required': 'father Occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'any.required': 'father contact is required',
  }),
  motherName: Joi.string().required().messages({
    'any.required': 'mother name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'any.required': 'mother Occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'any.required': 'mother contact is required',
  }),
});

// Define Joi schema for LocalGuardian
const localGuardianSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'localGuardian name is required',
  }),
  occupation: Joi.string().required().messages({
    'any.required': 'localGuardian occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'localGuardian contact is required',
  }),
  address: Joi.string().required().messages({
    'any.required': 'address is required',
  }),
});

// Define Joi schema for Student
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'id is required',
  }),
  name: userNameSchema.required().messages({
    'any.required': 'name is required',
  }),
  gender: Joi.string().valid('male', 'female', 'others').required().messages({
    'any.only': '{#value} is not valid',
    'any.required': 'gender is required',
  }),
  dateOfBirth: Joi.string(),
  email: Joi.string().email().required().messages({
    'any.required': 'email is required',
    'string.email': '{#value} is not a valid email type',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'contactNo is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'any.required': 'emergency contact is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'any.required': 'presentAddress is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'any.required': 'permanentAddress is required',
  }),
  guardian: guardianSchema.required().messages({
    'any.required': 'guardian is required',
  }),
  localGuardian: localGuardianSchema.required().messages({
    'any.required': 'localGuardian is required',
  }),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default studentValidationSchema;
