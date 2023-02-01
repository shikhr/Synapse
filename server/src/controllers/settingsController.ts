import { Response } from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comments.js';
import Bookmark from '../models/Bookmark.js';
import Avatar from '../models/Avatar.js';
import { BadRequestError } from '../errors/errors.js';

const changePassword = async (req: any, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!req.user.password) {
    throw new BadRequestError('you have logged in with email', [
      'oldPassword',
      'newPassword',
    ]);
  }
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('please provide valid passwords', [
      'oldPassword',
      'newPassword',
    ]);
  }
  if (!(await req.user.comparePassword(oldPassword))) {
    throw new BadRequestError('please provide correct password', [
      'oldPassword',
    ]);
  }
  if (oldPassword === newPassword) {
    throw new BadRequestError('you cannot use the same password', [
      'newPassword',
    ]);
  }
  req.user.password = newPassword;
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
