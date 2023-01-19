import { Response } from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comments.js';
import Bookmark from '../models/Bookmark.js';
import Avatar from '../models/Avatar.js';

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

export { deleteAccount };
