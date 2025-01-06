import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../types';

export const validateRequest = (schema: z.ZodType<any, any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated data
      req['body'] = validatedData['body'];
      req['query'] = validatedData['query'];
      req['params'] = validatedData['params'];

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(400, 'Validation error', {
            errors: error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          })
        );
      } else {
        next(error);
      }
    }
  };
};

export const createValidationSchema = (
  body?: z.ZodType<any, any>,
  query?: z.ZodType<any, any>,
  params?: z.ZodType<any, any>
) => {
  return z.object({
    body: body || z.object({}),
    query: query || z.object({}),
    params: params || z.object({}),
  });
};
