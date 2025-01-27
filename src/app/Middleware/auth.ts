import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../Error/Apperror';
import { TUserRole } from '../Modules/user/user.interface';
import { User } from '../Modules/user/user.model';
import config from '../config';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // check if the token is send from client side
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_token as string,
    ) as JwtPayload;

    // check if the token is valid
    const { role, userId, iat } = decoded;

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

    //
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    // decoded undefined
    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
