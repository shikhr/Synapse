import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error implements ApiError {
  constructor(message: string) {
    super(message);
  }
}

class BadRequestError extends CustomAPIError implements ApiError {
  statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}
class NotFoundError extends CustomAPIError implements ApiError {
  statusCode = StatusCodes.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}
class UnauthenticatedError extends CustomAPIError implements ApiError {
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export { CustomAPIError, BadRequestError, NotFoundError, UnauthenticatedError };
