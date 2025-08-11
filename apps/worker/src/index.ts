import { config } from 'dotenv';
config();
import { connectDB } from './db.js';
import { createConsumer } from './utils/rabbitmq.js';
import mongoose from 'mongoose';

import { opts, handler } from './consumers/notification-consumer.js';

async function main() {
  await connectDB();
  const { consumer, rabbit } = await createConsumer(opts, handler);

  process.on('SIGINT', async () => {
    await consumer.close();
    await rabbit.close();
    await mongoose.connection.close();
    process.exit(0);
  });

  console.log('Worker is consuming messages...');
}

main().catch((e) => {
  console.error('Worker failed to start', e);
  process.exit(1);
});
