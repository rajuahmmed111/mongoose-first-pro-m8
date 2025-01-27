import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    // zod
    await schema.parseAsync({
      body: req.body,
      cookie: req.cookies,
    });
    next();
  });
};

export default validateRequest;
