import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './database/connectDB.js';
import cors from 'cors';
import 'express-async-errors';
import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
