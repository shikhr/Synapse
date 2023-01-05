import express from 'express';
import passport from 'passport';
import { signin, signup, refresh } from '../controllers/authController.js';
import { oAuthSuccess } from '../controllers/oAuthController.js';

const router = express.Router();

router.route('/signin').post(signin);

router.route('/signup').post(signup);

router
  .route('/refresh')
  .get(passport.authenticate('refresh_jwt', { session: false }), refresh);

router.route('/google').get(
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  oAuthSuccess
);

export default router;
