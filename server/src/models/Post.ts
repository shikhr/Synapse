import mongoose, { Schema, model, Model } from 'mongoose';
import User, { UserModel } from './User.js';

interface IPost {
  description: string;
  createdBy: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  media: Array<string>;
}

interface PostInterface extends IPost {
  getPostInfo(user: UserModel): Promise<any>;
}

interface PostModel extends Model<PostInterface> {
  getFeed(user: UserModel, options: Record<string, any>): Promise<any>;
}

const postSchema = new Schema<IPost, PostModel>(
  {
    description: {
      type: String,
      required: true,
      maxlength: 1000,
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

const aggregatePipeline = [
  {
    $lookup: {
      from: User.collection.name,
      localField: 'createdBy',
      foreignField: '_id',
      pipeline: [
        {
          $project: {
            username: 1,
            displayName: 1,
            avatarId: 1,
          },
        },
      ],
      as: 'createdBy',
    },
  },
  {
    $set: {
      createdBy: { $first: '$createdBy' },
    },
  },
];

postSchema.method('getPostInfo', async function (user) {
  const post = this;
  return await Post.aggregate([
    { $match: { _id: post._id } },
    ...aggregatePipeline,
    {
      $set: {
        likesCount: { $size: '$likes' },
        hasLiked: {
          $in: [user._id, '$likes'],
        },
        followExists: {
          $in: ['$createdBy._id', user.following],
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

postSchema.static(
  'getFeed',
  async function (
    user,
    {
      page,
      filterBy = 'hot',
      createdBy,
    }: { page: number; filterBy: 'hot' | 'new'; createdBy: string }
  ) {
    const size = 3;
    const query: any = {
      hot: {
        match: {
          createdAt: { $gt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        },
        sort: { followExists: -1, likes: -1, createdAt: -1 },
      },
      new: {
        match: {},
        sort: { followExists: -1, createdAt: -1 },
      },
    };
    const matchQuery = query[filterBy].match;
    if (createdBy) {
      matchQuery.createdBy = new mongoose.Types.ObjectId(createdBy);
    }
    const sortQuery = query[filterBy].sort;

    return await this.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          followExists: {
            $in: ['$createdBy', user.following],
          },
        },
      },
      { $sort: sortQuery },
      {
        $project: {
          _id: 1,
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
              $addFields: {
                currentPage: Number(page),
                hasMorePages: { $gt: ['$count', Number(page) * size] },
                totalPages: { $ceil: { $divide: ['$count', size] } },
              },
            },
            {
              $project: {
                currentPage: 1,
                hasMorePages: 1,
                totalPages: 1,
              },
            },
          ],
        },
      },
      {
        $set: {
          mydata: '$mydata._id',
          meta: { $first: '$meta' },
        },
      },
    ]);
  }
);

const Post = model<IPost, PostModel>('Post', postSchema);

export default Post;
