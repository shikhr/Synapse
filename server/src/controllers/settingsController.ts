import { Response } from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comments.js';
import Bookmark from '../models/Bookmark.js';
import Avatar from '../models/Avatar.js';
import { BadRequestError } from '../errors/errors.js';

const changePassword = async (req: any, res: Response) => {
  const { old_password, new_password } = req.body;
  if (!req.user.password) {
    throw new BadRequestError('you have logged in with email', [
      'old_password',
      'new_password',
    ]);
  }
  if (!old_password || !new_password) {
    throw new BadRequestError('please provide valid passwords', [
      'old_password',
      'new_password',
    ]);
  }
  if (!(await req.user.comparePassword(old_password))) {
    throw new BadRequestError('please provide correct password', [
      'old_password',
    ]);
  }
  if (old_password === new_password) {
    throw new BadRequestError('you cannot use the same password', [
      'new_password',
    ]);
  }
  req.user.password = new_password;
  await req.user.save();
  res.send('password changed successfully');
};

const deleteAccount = async (req: any, res: Response) => {
  const user = req.user;
  await User.updateMany(
    { $in: [user._id, '$followers'] },
    { $pull: { followers: user._id } },
    { multi: true }
  );
  await User.updateMany(
    { $in: [user._id, '$following'] },
    { $pull: { following: user._id } },
    { multi: true }
  );
  await Bookmark.deleteMany({ createdBy: user._id });
  await Comment.deleteMany({ createdBy: user._id });
  await Post.deleteMany({ createdBy: user._id });
  if (user.avatarId) {
    await Avatar.findByIdAndDelete(user.avatarId);
  }
  await User.findByIdAndDelete(user._id);
  res.send({ success: true });
};

export { deleteAccount, changePassword };
