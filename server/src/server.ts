import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './database/connectDB.js';
import cors from 'cors';
import 'express-async-errors';

import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleware from './middleware/not-found.js';

import AuthRouter from './routes/authRoutes.js';
import PostRouter from './routes/postRoutes.js';
import {
  AuthenticateJwtStrategy,
  RefreshJwtStrategy,
} from './middleware/auth-middleware.js';
import passport from 'passport';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use('authenticate_jwt', AuthenticateJwtStrategy);
passport.use('refresh_jwt', RefreshJwtStrategy);

app.get('/', (req, res) => {
  res.send('MERNLY API');
});

app.use('/api/v1/auth', AuthRouter);

app.use(
  '/api/v1/posts',
  passport.authenticate('authenticate_jwt', { session: false }),
  PostRouter
);

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
