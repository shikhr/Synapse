import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.js";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("MERNLY API");
});

const PORT = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
