import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { UnauthenticatedError } from '../errors/errors.js';
dotenv.config();

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const MyJwtStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.userId);
    if (!user) {
      throw new UnauthenticatedError('Authentication Invalid');
    }
    return done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default MyJwtStrategy;
