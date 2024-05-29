/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is create successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};