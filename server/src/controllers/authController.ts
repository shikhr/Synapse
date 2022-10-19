import { Request, Response } from 'express';

const signup = async (req: Request, res: Response) => {
  res.send('signup');
};

const signin = async (req: Request, res: Response) => {
  res.send('sigin');
};

const refresh = async (req: Request, res: Response) => {
  res.send('refresh');
};

export { signup, signin, refresh };
