import mongoose from 'mongoose';

export async function connectDB(mongoUrl?: string) {
  const url =
    mongoUrl || process.env.MONGO_URL || 'mongodb://mongo:27017/synapse';
  await mongoose.connect(url);
  console.log('Worker connected to MongoDB');
}
