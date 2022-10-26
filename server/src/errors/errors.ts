import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class BadRequestError extends CustomAPIError implements ApiError {
  statusCode = StatusCodes.BAD_REQUEST;
  fields;
  constructor(message: string, fields: string[] = []) {
    super(message);
    this.fields = fields;
  }
}
class NotFoundError extends CustomAPIError implements ApiError {
  statusCode = StatusCodes.NOT_FOUND;
  fields;
  constructor(message: string, fields: string[] = []) {
    super(message);
    this.fields = fields;
  }
}
class UnauthenticatedError extends CustomAPIError implements ApiError {
  statusCode = StatusCodes.UNAUTHORIZED;
  fields;
  constructor(message: string, fields: string[] = []) {
    super(message);
    this.fields = fields;
  }
}

export { CustomAPIError, BadRequestError, NotFoundError, UnauthenticatedError };
