import mongoose from "mongoose";

const connectDB = (url: string | undefined) => {
  if (!url) throw new Error();
  return mongoose.connect(url);
};

export default connectDB;
