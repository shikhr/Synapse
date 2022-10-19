import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/connectDB.js';
dotenv.config();

import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();

app.get('/', (req, res) => {
  res.send('MERNLY API');
});

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
