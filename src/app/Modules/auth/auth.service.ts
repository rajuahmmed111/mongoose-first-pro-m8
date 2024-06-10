import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import AppError from '../../Error/Apperror';
import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payLoad: TLoginUser) => {
  // check if the user is exist !
  const isUserExists = await User.findOne({ id: payLoad?.id });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found !');
  }

  //   ----------- using statics--------
  //   if (!(await User.isUserExistsCustomId(payLoad.id))) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'This User is not found !');
  //   }

  // check if the user is already deleted !
  const isDeleted = isUserExists?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is deleted !');
  }

  // check if the user is blocked !
  const userStatus = isUserExists?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is blocked !');
  }

  // checked if the password is correct
  const isPasswordMatch = await bcrypt.compare(
    payLoad.password,
    isUserExists.password,
  );
  if (isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password doj not match!');
  }

  // Access Granted: send access token and refresh token
  // create token and send client side
  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    needsPasswordChange: isUserExists.needsPasswordChange,
  };
};

export const authServices = {
  loginUser,
};
