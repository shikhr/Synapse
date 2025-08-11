import { NextFunction, Request, Response } from 'express';

const errorHandlerMiddleware = async (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorConfig = {
    message: error.message || 'Something went wrong',
    statusCode: error.statusCode || 500,
    fields: error.fields || [],
  };
  res
    .status(errorConfig.statusCode)
    .json({ msg: errorConfig.message, fields: errorConfig.fields });
};

export default errorHandlerMiddleware;
