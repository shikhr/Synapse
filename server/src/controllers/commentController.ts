import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError } from '../errors/errors.js';
import Comment from '../models/Comments.js';
import Post from '../models/Post.js';

const addComment = async (req: any, res: Response) => {
  let { postId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new BadRequestError('please provide comment content', ['content']);
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError('post not found');
  }
  const comment = await Comment.create({
    content,
    createdBy: req.user._id,
    postId: post._id,
  });
  const [commentInfo] = await Comment.getCommentInfo(comment._id, req.user);
  res.send(commentInfo);
};

const getComment = async (req: any, res: Response) => {
  let { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) {
    throw new BadRequestError('comment id invalid');
  } else {
    commentId = new mongoose.Types.ObjectId(commentId);
  }
  const [commentInfo] = await Comment.getCommentInfo(commentId, req.user);
  if (!commentInfo) {
    throw new NotFoundError('comment not found');
  }
  res.send(commentInfo);
};

const getCommentList = async (req: any, res: Response) => {
  let { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) {
    throw new BadRequestError('post id invalid');
  } else {
    postId = new mongoose.Types.ObjectId(postId);
  }
  const [commentList] = await Comment.getCommentList({ postId, ...req.query });
  res.send(commentList);
};

const getUserComments = async (req: any, res: Response) => {
  let { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('user id invalid');
  } else {
    userId = new mongoose.Types.ObjectId(userId);
  }
  const [commentList] = await Comment.getCommentList({
    createdBy: userId,
    ...req.query,
  });
  res.send(commentList);
};

const likeComment = async (req: any, res: Response) => {
  const { key, commentId } = req.body;
  const userId = req.user._id;
  const options: any = {};
  if (key == 1) {
    options['$addToSet'] = { likes: userId };
  } else if (key == -1) {
    options['$pull'] = { likes: userId };
  } else {
    throw new BadRequestError('Invalid key');
  }
  const comment = await Comment.findByIdAndUpdate(commentId, options);
  if (!comment) {
    throw new NotFoundError('comment not found');
  }
  const [commentInfo] = await Comment.getCommentInfo(comment._id, req.user);
  res.send(commentInfo);
};

const removeComment = async (req: any, res: Response) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new BadRequestError('comment not found');
  }
  if (!req.user._id.equals(comment.createdBy)) {
    throw new BadRequestError('comment not created by user');
  }
  await Comment.findByIdAndDelete(comment.id);
  res.send('successfully deleted');
};

export {
  getComment,
  getCommentList,
  addComment,
  getUserComments,
  removeComment,
  likeComment,
};
