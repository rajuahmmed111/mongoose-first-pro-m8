import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../Error/Apperror';
import { TUserRole } from '../Modules/user/user.interface';
import config from '../config';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // check if the token is send from client side
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_token as string,
      function (err, decoded) {
        // err
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        const role = (decoded as JwtPayload).role;
        console.log(role);
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }
        // decoded undefined
        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};
export default auth;
