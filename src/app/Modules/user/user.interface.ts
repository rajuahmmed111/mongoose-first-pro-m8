/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  changePasswordAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  isUserExistsCustomId(id: string): Promise<TUser | null>;
  isJwtIssuedBeforePasswordChange(
    passwordChangeTimestamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}
