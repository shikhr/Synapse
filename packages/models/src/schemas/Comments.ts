import mongoose, { Schema, model, Model } from 'mongoose';
import User, { UserModel } from './User.js';

interface IComment {
  content: String;
  postId: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdBy: Schema.Types.ObjectId;
}

interface queryOptions {
  page: number;
  filterBy: 'hot' | 'new';
  createdBy: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
}

interface CommentInterface extends IComment {}

interface CommentModel extends Model<CommentInterface> {
  getCommentInfo(
    commentId: mongoose.Types.ObjectId,
    user: UserModel
  ): Promise<any>;
  getCommentList(options: queryOptions): Promise<any>;
  searchComments(query: string, page: number, user: UserModel): Promise<any>;
}

const commentSchema = new Schema<IComment, CommentModel>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 350,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.static('getCommentInfo', async function (commentId, user) {
  return this.aggregate([
    {
      $match: { _id: commentId },
    },
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
    {
      $set: {
        likesCount: { $size: '$likes' },
        hasLiked: {
          $in: [user._id, '$likes'],
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

commentSchema.static(
  'getCommentList',
  async function ({
    page = 1,
    filterBy = 'hot',
    createdBy,
    postId,
  }: queryOptions) {
    const size = 5;
    const sortQuery: any = {
      hot: { likes: -1 },
      new: { createdAt: -1 },
    };
    const matchQuery: {
      postId?: mongoose.Types.ObjectId;
      createdBy?: mongoose.Types.ObjectId;
    } = {};

    if (createdBy) {
      matchQuery.createdBy = createdBy;
    }
    if (postId) {
      matchQuery.postId = postId;
    }
    return this.aggregate([
      { $match: matchQuery },
      { $sort: sortQuery[filterBy] },
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

commentSchema.static(
  'searchComments',
  async function (query: string, page: number = 1, user: UserModel) {
    const size = 10;
    const searchRegex = new RegExp(query, 'i');
    const [result] = await this.aggregate([
      {
        $match: {
          content: searchRegex,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * size }, { $limit: size }],
          meta: [
            { $count: 'count' },
            {
              $addFields: {
                currentPage: Number(page),
                hasMorePages: { $gt: ['$count', Number(page) * size] },
                totalPages: { $ceil: { $divide: ['$count', size] } },
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
    return result;
  }
);

const Comment = mongoose.model<IComment, CommentModel>(
  'Comment',
  commentSchema
);

export default Comment;
export type { IComment, CommentInterface, CommentModel, queryOptions };
