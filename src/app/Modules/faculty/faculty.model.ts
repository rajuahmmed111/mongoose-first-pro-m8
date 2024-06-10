import { Schema, model } from 'mongoose';
import { FacultyModel, TFaculty, TUserName } from './faculty.interface';

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

const facultySchema = new Schema<TFaculty, FacultyModel>(
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
    designation: {
      type: String,
      required: [true, 'Designation is required'],
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
    profileImg: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
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
facultySchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// Query middleware
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// [{$match: {isDeleted: {$ne; true}}}, {$match: {id: 12349}}]
facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// create a static methods
facultySchema.statics.isUserExists = async function (id: string) {
  const exitingUser = await Faculty.findOne({ id });
  return exitingUser;
};

// create model
export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
