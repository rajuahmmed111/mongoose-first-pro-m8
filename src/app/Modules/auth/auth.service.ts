import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../Error/Apperror';
import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { cerateToken } from './auth.utiles';

const loginUser = async (payLoad: TLoginUser) => {
  // check if the user is exist !

  // const isUserExists = await User.findOne({ id: payLoad?.id }).select(
  //   '+password',
  // );

  //   ----------- using statics--------
  const isUserExists = await User.isUserExistsCustomId(payLoad.id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found !');
  }

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
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match!');
  }

  // Access Granted: send access token and refresh token
  // create token and send client side
  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  // access token
  const accessToken = cerateToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string,
  );

  // refresh token
  const refreshToken = cerateToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExists.needsPasswordChange,
  };
};

// change password
const changePassword = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  // console.log('user', userData, 'payload', payLoad);

  const isUserExists = await User.findOne({ id: userData.userId }).select(
    '+password',
  );
  console.log(isUserExists);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found !');
  }

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
    payLoad.oldPassword,
    isUserExists.password,
  );
  if (isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password doj not match!');
  }

  // hash new password
  const newHashPassword = await bcrypt.hash(
    payLoad.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      changePasswordAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string,
  ) as JwtPayload;

  // check if the token is valid
  const { userId, iat } = decoded;

  const isUserExists = await User.isUserExistsCustomId(userId);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found !');
  }

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

  if (
    isUserExists?.changePasswordAt &&
    User.isJwtIssuedBeforePasswordChange(
      isUserExists?.changePasswordAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !!');
  }

  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  // access token
  const accessToken = cerateToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
};
