import mongoose, { model, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser {
  // schema interface
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string;
  birthDate: Schema.Types.Date;
  location: string;
  website: string;
  provider: string;
  following: Array<Schema.Types.ObjectId>;
  followers: Array<Schema.Types.ObjectId>;
  refreshTokens: Array<String>;
  avatarId: Schema.Types.ObjectId;
}

interface UserInterface extends IUser {
  // instance methods
  createAccessToken: () => string;
  createRefreshToken: () => string;
  comparePassword: (rawPassword: string) => Promise<boolean>;
  getUserProfile: () => { key: any };
}
interface UserModel extends Model<UserInterface> {
  // static methods
  getFullProfile: (
    matchId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ) => Promise<any>;
}

const userSchema = new Schema<IUser, UserModel>({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    maxlength: 20,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    validate: {
      validator: (str: string) => validator.isEmail(str),
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: false,
    trim: true,
    minlength: [8, 'Password should be greater than 8 characters'],
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [30, 'Name should be less than 30 characters'],
  },
  birthDate: {
    type: Schema.Types.Date,
    required: false,
  },
  bio: {
    type: String,
    required: false,
    trim: true,
    maxlength: [150, 'Name should be less than 150 characters'],
  },
  location: {
    type: String,
    required: false,
    trim: true,
    maxlength: [30, 'Location should be less than 30 characters'],
  },
  website: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: (str: string) => validator.isURL(str),
      message: 'Please provide a valid URL',
    },
    maxlength: [60, 'Website should be less than 60 characters'],
  },
  provider: {
    type: String,
    required: false,
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  refreshTokens: [
    {
      type: String,
    },
  ],
  avatarId: {
    type: Schema.Types.ObjectId,
    ref: 'Avatar',
  },
});

userSchema.pre('save', async function () {
  const user = this;
  if (!user.isModified('password')) {
    return;
  }
  user.password = await bcrypt.hash(user.password, 10);
});

userSchema.method('createAccessToken', function () {
  const token: string = jwt.sign(
    { userId: this._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: 600 }
  );
  return token;
});

userSchema.method('createRefreshToken', function () {
  const token: string = jwt.sign(
    { userId: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '7d' }
  );
  return token;
});

userSchema.method('comparePassword', async function (rawPassword) {
  const isMatch = await bcrypt.compare(rawPassword, this.password);
  return isMatch;
});

userSchema.method('getUserProfile', function () {
  const { _id, username, displayName, email, avatarId } = this;
  return { _id, username, displayName, email, avatarId };
});

userSchema.static(
  'getFullProfile',
  async function (
    matchId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ) {
    return User.aggregate([
      { $match: { _id: matchId } },
      {
        $addFields: {
          isFollowing: { $in: [userId, '$followers'] },
          followers: { $size: '$followers' },
          following: { $size: '$following' },
        },
      },
      {
        $project: {
          username: 1,
          displayName: 1,
          avatarId: 1,
          bio: 1,
          birthDate: 1,
          location: 1,
          website: 1,
          followers: 1,
          following: 1,
          isFollowing: 1,
        },
      },
    ]);
  }
);

const User = model<IUser, UserModel>('User', userSchema);

export default User;
export { UserModel, IUser, UserInterface };
