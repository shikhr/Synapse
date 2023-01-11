import mongoose, { Schema, model, Model } from 'mongoose';
import Bookmark from './Bookmark.js';
import Comment from './Comments.js';
import User, { UserModel } from './User.js';

interface IPost {
  description: string;
  createdBy: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  media: Array<string>;
}

interface queryOptions {
  page: number;
  filterBy: 'hot' | 'new' | 'all';
  createdBy: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
}

interface PostInterface extends IPost {}

interface PostModel extends Model<PostInterface> {
  getPostInfo(postId: mongoose.Types.ObjectId, user: UserModel): Promise<any>;
  getFeed(options: queryOptions, user?: UserModel): Promise<any>;
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

const userAggregatePipeline = [
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

postSchema.static('getPostInfo', async function (postId, user) {
  return this.aggregate([
    { $match: { _id: postId } },
    ...userAggregatePipeline,
    {
      $lookup: {
        from: Comment.collection.name,
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: Bookmark.collection.name,
        let: { post_id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$$post_id', '$postId'] },
                  { $eq: ['$createdBy', user._id] },
                ],
              },
            },
          },
        ],
        as: 'bookmarks',
      },
    },
    {
      $set: {
        bookmarks: {
          $first: '$bookmarks',
        },
      },
    },
    {
      $set: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$comments' },
        hasLiked: {
          $in: [user._id, '$likes'],
        },
        hasBookmarked: {
          $eq: [user._id, '$bookmarks.createdBy'],
        },
        followExists: {
          $in: ['$createdBy._id', user.following],
        },
      },
    },
    {
      $project: {
        likes: 0,
        comments: 0,
        bookmarks: 0,
        updatedAt: 0,
      },
    },
  ]);
});

postSchema.static(
  'getFeed',
  async function ({ page, filterBy = 'hot', createdBy }: queryOptions, user) {
    const size = 5;
    const query: any = {
      hot: {
        match: {
          createdAt: { $gt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        },
        sort: { followExists: -1, likes: -1, createdAt: -1 },
      },
      new: {
        match: {},
        sort: { followExists: -1, createdAt: 1 },
      },
      all: {
        match: {},
        sort: { likes: -1, createdAt: -1 },
      },
    };
    const matchQuery = query[filterBy].match;
    if (createdBy) {
      matchQuery.createdBy = createdBy;
    }
    const sortQuery = query[filterBy].sort;

    let followExistsField: any = false;
    if (user) {
      followExistsField = {
        $in: ['$createdBy', user.following],
      };
    }

    return this.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          followExists: followExistsField,
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
          data: [{ $skip: (page - 1) * size }, { $limit: size }],
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
          data: '$data._id',
          meta: { $first: '$meta' },
        },
      },
    ]);
  }
);

const Post = model<IPost, PostModel>('Post', postSchema);

export default Post;
