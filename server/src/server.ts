import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './database/connectDB.js';
import cors from 'cors';
import 'express-async-errors';

import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

// ROUTER IMPORT
import AuthRouter from './routes/authRoutes.js';
import PostRouter from './routes/postRoutes.js';
import UserRouter from './routes/userRoutes.js';

import {
  AuthenticateJwtStrategy,
  RefreshJwtStrategy,
} from './middleware/auth-middleware.js';
import passport from 'passport';

const app = express();

// EXPRESS MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUTH MIDDLEWARE
passport.use('authenticate_jwt', AuthenticateJwtStrategy);
passport.use('refresh_jwt', RefreshJwtStrategy);

// HOME ROUTER
app.get('/', (req, res) => {
  res.send('MERNLY API');
});

// AUTH ROUTER
app.use('/api/v1/auth', AuthRouter);

// POST ROUTER
app.use(
  '/api/v1/posts',
  passport.authenticate('authenticate_jwt', { session: false }),
  PostRouter
);

// USER ROUTER
app.use(
  '/api/v1/users',
  passport.authenticate('authenticate_jwt', { session: false }),
  UserRouter
);

// FALLBACK MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log('Connected to Database');
    app.listen(PORT, () => {
      console.log(`listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
