import { Schema, model } from 'mongoose';

interface IAvatar {
  data: Buffer;
}

const avatarSchema = new Schema<IAvatar>({
  data: {
    type: Buffer,
    required: true,
  },
});

const Avatar = model<IAvatar>('Avatar', avatarSchema);

export default Avatar;
export type { IAvatar };
