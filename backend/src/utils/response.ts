import { Response } from 'express';

export const handleResponse = (res: Response, status: number, data: any) => {
  if (status >= 400) {
    // For error responses, wrap the error message in an object
    return res.status(status).json({
      error: data.message || 'An error occurred',
      errors: data.errors,
    });
  }

  // For successful responses, return the data directly
  return res.status(status).json(data);
};
