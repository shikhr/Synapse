import { Schema, model, Model } from 'mongoose';
import User from './User.js';

interface IPost {
  description: string;
  createdBy: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  media: Array<string>;
}

interface PostInterface extends IPost {
  getPostInfo(id: Schema.Types.ObjectId): Promise<any>;
}

interface PostModel extends Model<PostInterface> {
  getFeed(id: Schema.Types.ObjectId): Promise<any>;
}

const postSchema = new Schema<IPost, PostModel>(
  {
    description: {
      type: String,
      required: true,
      maxlength: 400,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      requires: true,
    },
    media: [
      {
        type: String,
        required: false,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const aggregatePipeline = {
  $lookup: {
    from: User.collection.name,
    localField: 'createdBy',
    foreignField: '_id',
    pipeline: [
      {
        $project: {
          username: 1,
          avatarId: 1,
        },
      },
    ],
    as: 'createdBy',
  },
};

postSchema.method('getPostInfo', async function (id) {
  const post = this;
  return await Post.aggregate([
    { $match: { _id: post._id } },
    aggregatePipeline,
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        hasLiked: {
          $in: [id, '$likes'],
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ]);
});

postSchema.static('getFeed', async function (id) {
  return await this.aggregate([
    { $sort: { createdAt: -1 } },
    aggregatePipeline,
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        hasLiked: {
          $in: [id, '$likes'],
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ]);
});

const Post = model<IPost, PostModel>('Post', postSchema);

export default Post;
