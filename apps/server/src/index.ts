import express, { Request, Response } from 'express';
import { config } from 'dotenv';
config();
import connectDB from './database/connectDB.js';
import cors from 'cors';
import 'express-async-errors';
import path, { dirname } from 'path';

import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

// ROUTER IMPORT
import AuthRouter from './routes/authRoutes.js';
import PostRouter from './routes/postRoutes.js';
import UserRouter from './routes/userRoutes.js';
import CommentRouter from './routes/commentRoutes.js';
import BookmarkRouter from './routes/bookmarkRoutes.js';
import SettingsRouter from './routes/settingsRoute.js';
import SearchRouter from './routes/searchRoutes.js';
import NotificationRouter from './routes/notificationRoutes.js';

import {
  AuthenticateJwtStrategy,
  RefreshJwtStrategy,
  OAUTHGoogleStrategy,
} from './middleware/auth-middleware.js';
import passport from 'passport';
import { getAvatar } from './controllers/userController.js';
import { publishEvent } from './utils/rabbitmq.js';

const app = express();

// EXPRESS MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUTH MIDDLEWARE
passport.use('authenticate_jwt', AuthenticateJwtStrategy);
passport.use('refresh_jwt', RefreshJwtStrategy);
passport.use('google', OAUTHGoogleStrategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

// HOME ROUTER
app.get('/api/v1', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the API',
    version: '1.0.0',
  });
});

// AUTH ROUTER
app.use('/api/v1/auth', AuthRouter);

// POST ROUTER
app.use(
  '/api/v1/posts',
  passport.authenticate('authenticate_jwt', { session: false }),
  PostRouter
);

app.use('/api/v1/users/avatar/:avatarId', getAvatar);
// USER ROUTER
app.use(
  '/api/v1/users',
  passport.authenticate('authenticate_jwt', { session: false }),
  UserRouter
);

app.use(
  '/api/v1/comments',
  passport.authenticate('authenticate_jwt', { session: false }),
  CommentRouter
);

app.use(
  '/api/v1/bookmarks',
  passport.authenticate('authenticate_jwt', { session: false }),
  BookmarkRouter
);

app.use(
  '/api/v1/settings',
  passport.authenticate('authenticate_jwt', { session: false }),
  SettingsRouter
);

app.use(
  '/api/v1/search',
  passport.authenticate('authenticate_jwt', { session: false }),
  SearchRouter
);

app.use(
  '/api/v1/notifications',
  passport.authenticate('authenticate_jwt', { session: false }),
  NotificationRouter
);

// FALLBACK MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log('Connected to Database');

    // Warm up RabbitMQ connection (non-blocking)
    publishEvent({ type: 'app.start', data: { ts: Date.now() } }).catch(
      () => {}
    );

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
