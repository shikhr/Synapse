import mongoose, { Schema, Document, model } from 'mongoose';

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
  id?: mongoose.Types.ObjectId; // optional for System announcements
}

export interface INotification extends Document {
  to: mongoose.Types.ObjectId; // recipient
  from?: mongoose.Types.ObjectId; // actor
  type: NotificationKind;
  entity?: EntityRef; // reference to the related entity
  payload?: Record<string, any>; // extra data for UI
  read: boolean;
  createdAt: Date;
}

const EntitySchema = new Schema<EntityRef>(
  {
    kind: {
      type: String,
      enum: ['User', 'Post', 'Comment', 'System'],
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      refPath: 'entity.kind',
      required: false,
    },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotification>(
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

export default model<INotification>('Notification', NotificationSchema);
