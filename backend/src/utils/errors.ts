import type { StatusCode } from 'hono/utils/http-status';

export class AppError extends Error {
  statusCode: StatusCode;
  isOperational: boolean;

  constructor(message: string, statusCode: StatusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export type ErrorResponse = {
  message: string;
  statusCode: StatusCode;
  error: string;
};
