import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.NOT_FOUND).send('Page Not found');
};

export default notFoundMiddleware;
