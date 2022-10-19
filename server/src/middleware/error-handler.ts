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
  };
  res.status(errorConfig.statusCode).json({ msg: errorConfig.message });
};

export default errorHandlerMiddleware;
