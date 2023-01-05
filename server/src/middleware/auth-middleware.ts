import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { UnauthenticatedError } from '../errors/errors.js';
dotenv.config();

const authenticate_options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
const refresh_options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.REFRESH_TOKEN_SECRET,
};

const AuthenticateJwtStrategy = new JwtStrategy(
  authenticate_options,
  async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.userId);
      if (!user) {
        throw new UnauthenticatedError('Authentication Invalid');
      }
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

const RefreshJwtStrategy = new JwtStrategy(
  refresh_options,
  async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.userId);
      if (!user) {
        throw new UnauthenticatedError('Authentication Invalid');
      }
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

const OAUTHGoogleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/v1/auth/google/redirect',
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) => {
    console.log(profile._json);
    let user = await User.findOne({ email: profile._json.email });
    if (user) {
      console.log('exists');
    } else {
      const usernameSeed = `user${new Date().getTime().toString().slice(8)}`;
      user = await User.create({
        username: usernameSeed,
        displayName: profile._json.name || usernameSeed,
        email: profile._json.email,
      });
    }
    const myAccessToken = user.createAccessToken();
    const myRefreshToken = user.createRefreshToken();
    done(null, {
      username: user.username,
      displayName: user.displayName,
      avatarId: user.avatarId,
      email: user.email,
      _id: user._id,
      refreshToken: myRefreshToken,
      accessToken: myAccessToken,
    });
  }
);

export { AuthenticateJwtStrategy, RefreshJwtStrategy, OAUTHGoogleStrategy };
