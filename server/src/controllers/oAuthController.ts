import { Response } from 'express';

const oAuthSuccess = async (req: any, res: Response) => {
  let url = '';
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5173';
    console.log('dev redirect');
  }
  const params = req.user;
  if (!req.user.avatarId) {
    delete params.avatarId;
  }
  const paramURL = new URLSearchParams(params);
  res.redirect(`${url}/authParams?${paramURL.toString()}`);
};

export { oAuthSuccess };
