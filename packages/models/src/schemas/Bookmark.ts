import mongoose, { Schema, model, Model } from 'mongoose';
import User, { UserModel } from './User.js';

interface queryOptions {
  userId: Schema.Types.ObjectId;
  page: number;
}

interface IBookmark {
  postId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
}

interface BookmarkInterface extends IBookmark {}

interface BookmarkModel extends Model<BookmarkInterface> {
  getBookmarkList(queryOptions: queryOptions): Promise<any>;
}

const bookmarkSchema = new Schema<IBookmark, BookmarkModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.static(
  'getBookmarkList',
  async function ({ userId, page = 1 }: queryOptions) {
    const size = 5;
    return await this.aggregate([
      { $match: { createdBy: userId } },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $project: { postId: 1, _id: 0 } },
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
          data: '$data.postId',
          meta: { $first: '$meta' },
        },
      },
    ]);
  }
);

const Bookmark = model<IBookmark, BookmarkModel>('bookmark', bookmarkSchema);

export default Bookmark;
export type { BookmarkModel, IBookmark, BookmarkInterface, queryOptions };
