import { model, Model, mongo, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser {
  // schema interface
  username: string;
  email: string;
  password: string;
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
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: false,
    trim: true,
    minlength: [8, 'Password should be greater than 8 characters'],
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
  const { _id, username, email, avatarId } = this;
  return { _id, username, email, avatarId };
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
