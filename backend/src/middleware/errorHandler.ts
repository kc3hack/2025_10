import type { Context } from 'hono';
import { z } from '@hono/zod-openapi';
import { AppError, type ErrorResponse } from '../utils/errors.js';

export const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string(),
});

export const errorHandler = (err: Error, c: Context) => {
  const errorResponse: ErrorResponse = {
    message: 'Internal Server Error: ' + err.message,
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
