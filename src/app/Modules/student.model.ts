import { Schema, model } from 'mongoose';
import {
  // StudentMethods,
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student/student.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: 'String',
    required: [true, 'first Name is required'],
    maxlength: [20, 'first Name can not maxLength allow more then 20'],
    trim: true,
  },
  middleName: {
    type: String,
    required: [true, 'middle Name is required'],
    maxlength: [20, 'middle Name can not maxLength allow more then 20'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const middleNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return middleNameStr === value;
      },
      message: '{VALUE} is not capitalize format',
    },
  },
  lastName: {
    type: String,
    required: [true, 'last Name is required'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'father name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'father Occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'father contact is required'],
  },
  motherName: {
    type: String,
    required: [true, 'father name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'mother Occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'mother contact is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'localGuardianSchema name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'localGuardianSchema occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'localGuardianSchema contact is required'],
  },
  address: {
    type: String,
    required: [true, 'address is required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, ' id is required'],
      unique: true,
      maxlength: [20, 'password not allow more then 20 character'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      ref: 'User',
      unique: true,
    },
    name: {
      type: userNameSchema,
      required: [true, 'name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message: '{VALUE} is not valid',
      },
      required: [true, 'gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'dateOfBirth is required'],
      unique: true,
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not valid email type',
      // },
    },
    contactNo: { type: String, required: [true, 'contactNo is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'contactNo is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'presentAddress is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'permanentAddress is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'guardian is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'localGuardian is required'],
    },
    profileImg: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// Query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// [{$match: {isDeleted: {$ne; true}}}, {$match: {id: 12349}}]
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// create a static methods
studentSchema.statics.isUserExists = async function (id: string) {
  const exitingUser = await Student.findOne({ id });
  return exitingUser;
};

// create instance methods
// studentSchema.methods.isUserExists = async function (id: string) {
//   const exitingUser = await Student.findOne({ id });
//   return exitingUser;
// };

// create model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
