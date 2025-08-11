import mongoose, { Schema, Document, model, Model } from 'mongoose';

export type NotificationKind =
  | 'user.follow'
  | 'user.unfollow'
  | 'post.like'
  | 'post.likes.threshold'
  | 'post.comment'
  | 'user.mention'
  | 'post.mention'
  | 'system.announcement';

export type EntityKind = 'User' | 'Post' | 'Comment' | 'System';

export interface EntityRef {
  kind: EntityKind;
  id?: mongoose.Types.ObjectId;
}

export interface INotification extends Document {
  to: mongoose.Types.ObjectId;
  from?: mongoose.Types.ObjectId;
  type: NotificationKind;
  entity?: EntityRef;
  payload?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface NotificationModel extends Model<INotification> {
  paginateForUser(
    userId: mongoose.Types.ObjectId,
    page?: number,
    size?: number
  ): Promise<
    | {
        data: any[];
        meta: {
          currentPage: number;
          hasMorePages: boolean;
          totalPages: number;
        };
      }
    | undefined
  >;
}

const EntitySchema = new Schema<EntityRef>(
  {
    kind: {
      type: String,
      enum: ['User', 'Post', 'Comment', 'System'],
      required: true,
    },
    id: { type: Schema.Types.ObjectId, refPath: 'entity.kind' },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotification, NotificationModel>(
  {
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    entity: { type: EntitySchema },
    payload: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ to: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ to: 1, createdAt: -1 });

NotificationSchema.static(
  'paginateForUser',
  async function (
    userId: mongoose.Types.ObjectId,
    page: number = 1,
    size: number = 10
  ) {
    const [result] = await this.aggregate([
      { $match: { to: userId } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: (Number(page) - 1) * size },
            { $limit: size },
            // Lookup minimal info about `from` user for display
            {
              $lookup: {
                from: 'users',
                let: { fromId: '$from' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$fromId'] } } },
                  { $project: { displayName: 1, avatarId: 1 } },
                ],
                as: 'fromUser',
              },
            },
            { $set: { fromUser: { $first: '$fromUser' } } },
            {
              $set: {
                fromDisplayName: {
                  $cond: [
                    { $ne: ['$from', null] },
                    '$fromUser.displayName',
                    null,
                  ],
                },
                fromAvatarId: {
                  $cond: [{ $ne: ['$from', null] }, '$fromUser.avatarId', null],
                },
                // Also merge into payload for clients expecting it there
                payload: {
                  $cond: [
                    { $ne: ['$from', null] },
                    {
                      $mergeObjects: [
                        { $ifNull: ['$payload', {}] },
                        {
                          fromDisplayName: '$fromUser.displayName',
                          fromAvatarId: '$fromUser.avatarId',
                        },
                      ],
                    },
                    '$payload',
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                to: 1,
                from: 1,
                type: 1,
                entity: 1,
                payload: 1,
                read: 1,
                createdAt: 1,
                fromDisplayName: 1,
                fromAvatarId: 1,
              },
            },
          ],
          meta: [
            { $count: 'count' },
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
      { $set: { meta: { $first: '$meta' } } },
    ]);
    return result;
  }
);

const Notification = model<INotification, NotificationModel>(
  'Notification',
  NotificationSchema
);

export default Notification;
