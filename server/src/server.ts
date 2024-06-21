import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
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

import {
  AuthenticateJwtStrategy,
  RefreshJwtStrategy,
  OAUTHGoogleStrategy,
} from './middleware/auth-middleware.js';
import passport from 'passport';
import { getAvatar } from './controllers/userController.js';
import { fileURLToPath } from 'url';

const app = express();

const __dirname = dirname(fileURLToPath(new URL('../', import.meta.url)));

// EXPRESS MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, './client/dist')));

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
  res.send('Synapse API!!!');
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

app.get('*', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: path.join(__dirname, './client/dist') });
});

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
