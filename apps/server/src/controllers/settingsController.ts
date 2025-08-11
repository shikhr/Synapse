import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/errors.js';
import { Avatar, Bookmark, Comment, Post, User } from '../models/index.js';

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
    { $pull: { followers: user._id } }
  );
  await User.updateMany(
    { $in: [user._id, '$following'] },
    { $pull: { following: user._id } }
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
