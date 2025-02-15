import type { Context } from 'hono';
import { AppError, type ErrorResponse } from '../utils/errors.js';

export const errorHandler = (err: Error, c: Context) => {
  const errorResponse: ErrorResponse = {
    message: 'Internal Server Error',
    statusCode: 500,
    error: 'InternalServerError',
  };

  if (err instanceof AppError) {
    errorResponse.message = err.message;
    errorResponse.statusCode = err.statusCode;
    errorResponse.error = err.constructor.name;
  }

  return c.json(errorResponse);
};
