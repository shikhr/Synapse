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
  getFeed(
    id: Schema.Types.ObjectId,
    options: Record<string, any>
  ): Promise<any>;
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

postSchema.static('getFeed', async function (user, { page }) {
  const size = 3;
  return await this.aggregate([
    {
      $match: {
        createdAt: { $gt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $addFields: {
        followExists: {
          $in: ['$createdBy', user.following],
        },
      },
    },
    { $sort: { followExists: -1, likes: -1, createdAt: -1 } },
    {
      $project: {
        _id: 1,
        description: 1,
        createdAt: 1,
        likes: 1,
        followExists: 1,
      },
    },
    {
      $facet: {
        mydata: [{ $skip: (page - 1) * size }, { $limit: size }],
        meta: [
          {
            $count: 'count',
          },
          {
            $project: {
              totalPages: { $ceil: { $divide: ['$count', size] } },
            },
          },
        ],
      },
    },
  ]);
});

// postSchema.static('getFeed', async function (id) {
//   return await this.aggregate([
//     { $sort: { createdAt: -1 } },
//     aggregatePipeline,
//     {
//       $addFields: {
//         likesCount: { $size: '$likes' },
//         hasLiked: {
//           $in: [id, '$likes'],
//         },
//       },
//     },
//     {
//       $project: {
//         likes: 0,
//       },
//     },
//   ]);
// });

const Post = model<IPost, PostModel>('Post', postSchema);

export default Post;
