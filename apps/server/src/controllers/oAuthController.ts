import { Response } from 'express';

const oAuthSuccess = async (req: any, res: Response) => {
  const url = process.env.FRONTEND_URL;
  if (!url) {
    throw new Error('FRONTEND_URL environment variable is not set');
  }

  const params = req.user;
  if (!req.user.avatarId) {
    delete params.avatarId;
  }
  const paramURL = new URLSearchParams(params);
  res.redirect(`${url}/authParams?${paramURL.toString()}`);
};

export { oAuthSuccess };
