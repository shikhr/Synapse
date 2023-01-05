import { Response } from 'express';

const oAuthSuccess = async (req: any, res: Response) => {
  let url = '';
  if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5173';
    console.log('dev redirect');
  }
  res.redirect(
    `${url}/authParams?accessToken=${req.user.accessToken}&refreshToken=${req.user.refreshToken}&_id=${req.user._id}&email=${req.user.email}&username=${req.user.username}&displayName=${req.user.displayName}`
  );
};

export { oAuthSuccess };
