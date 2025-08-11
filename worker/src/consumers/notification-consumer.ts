import Notification, { EntityRef } from '../models/Notification.js';
import mongoose, { get } from 'mongoose';

const handler = async (msg: any) => {
  try {
    const content = msg.body as any;
    const type: string = content.type;
    const data = content.data;

    console.log('Received message:', type, data);

    switch (type) {
      case 'user.follow': {
        const { followerId, followedId } = data as {
          followerId: string;
          followedId: string;
        };
        const entity: EntityRef = {
          kind: 'User',
          id: new mongoose.Types.ObjectId(followerId),
        };
        await Notification.create({
          to: new mongoose.Types.ObjectId(followedId),
          from: new mongoose.Types.ObjectId(followerId),
          type: 'user.follow',
          entity,
          payload: {},
        });
        break;
      }

      case 'user.unfollow': {
        const { followerId, unfollowedId } = data as {
          followerId: string;
          unfollowedId: string;
        };
        const entity: EntityRef = {
          kind: 'User',
          id: new mongoose.Types.ObjectId(followerId),
        };
        await Notification.create({
          to: new mongoose.Types.ObjectId(unfollowedId),
          from: new mongoose.Types.ObjectId(followerId),
          type: 'user.unfollow',
          entity,
          payload: {},
        });
        break;
      }

      case 'post.create': {
        const { authorId, postId } = data as {
          authorId: string;
          postId: string;
        };
        const entity: EntityRef = {
          kind: 'Post',
          id: new mongoose.Types.ObjectId(postId),
        };
        // create notification for all followers of the author
      }

      case 'post.like': {
        const { likerId, postId, ownerId } = data as {
          likerId: string;
          postId: string;
          ownerId: string;
        };
        const entity: EntityRef = {
          kind: 'Post',
          id: new mongoose.Types.ObjectId(postId),
        };
        await Notification.create({
          to: new mongoose.Types.ObjectId(ownerId),
          from: new mongoose.Types.ObjectId(likerId),
          type: 'post.like',
          entity,
          payload: {},
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    // rabbitmq-client auto-acks after handler resolves
    console.error('Worker failed to process message:', err);
    throw err; // propagate so client handles nack/retry
  }
};

const opts = {
  url: process.env.RABBITMQ_URL,
  exchange: process.env.RABBITMQ_EXCHANGE_NAME,
  queue: process.env.RABBITMQ_QUEUE,
  bindingKeys: [
    'user.*',
    'post.*',
    'comment.*',
    'bookmark.*',
    'test.*',
    'app.*',
    'system.*',
  ],
};

export { handler, opts };
