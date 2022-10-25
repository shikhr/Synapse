import { Request, Response } from 'express';
import { BadRequestError, UnauthenticatedError } from '../errors/errors.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError('Please provide all the values');
  }
  const validUser = await User.findOne({ $or: [{ username }, { email }] });
  if (validUser) {
    throw new BadRequestError('Email or username already in use');
  }
  const user = new User({ username, email, password });

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  user.refreshTokens.push(refreshToken);
  await user.save();

  console.log(accessToken, refreshToken);
  res.status(StatusCodes.OK).send({
    user: user.getUserProfile(),
    accessToken,
    refreshToken,
  });
};

const signin = async (req: Request, res: Response) => {
  const { identity, password } = req.body;
  if (!identity || !password) {
    throw new BadRequestError('Please provide all the values');
  }

  const user = await User.findOne({
    $or: [{ email: identity }, { username: identity }],
  });
  if (!user) {
    throw new UnauthenticatedError('Credentials are invalid');
  }
  if (!user.password) {
    throw new UnauthenticatedError('Credentials are invalid');
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new UnauthenticatedError('Credentials are invalid');
  }

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  user.refreshTokens.push(refreshToken);
  await user.save();

  res.status(StatusCodes.OK).send({
    user: user.getUserProfile(),
    accessToken,
    refreshToken,
  });
};

const refresh = async (req: Request, res: Response) => {
  res.send('refresh');
};

export { signup, signin, refresh };
