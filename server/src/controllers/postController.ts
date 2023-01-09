import { Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError } from '../errors/errors.js';
import Comment from '../models/Comments.js';
import Post from '../models/Post.js';
import { filestackFetch } from '../utils/filestackFetch.js';

const addPost = async (req: any, res: Response) => {
  const postParams: any = {};
  const user = req.user;
  const { description } = req.body;
  if (!description) {
    throw new BadRequestError('Please Provide a description', ['description']);
  }
  postParams.createdBy = user._id;
  postParams.description = description;
  if (req.files) {
    const data = await filestackFetch(req.files);
    postParams.media = data.map((item) => item.data.url);
  }
  const post = await Post.create(postParams);
  const [postInfo] = await Post.getPostInfo(post._id, user);
  res.send(postInfo);
};

const getPost = async (req: any, res: Response) => {
  let { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) {
    throw new NotFoundError('post not found');
  } else {
    postId = new mongoose.Types.ObjectId(postId);
  }
  const [postInfo] = await Post.getPostInfo(postId, req.user);
  if (!postInfo) {
    throw new NotFoundError('post not found');
  }
  res.status(200).send(postInfo);
};

const getFeed = async (req: any, res: Response) => {
  const [feed] = await Post.getFeed(req.query, req.user);

  res.status(200).send(feed);
};

const getExplore = async (req: any, res: Response) => {
  const [feed] = await Post.getFeed(req.query);

  res.status(200).send(feed);
};

const getUserPosts = async (req: any, res: Response) => {
  let { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('user id invalid');
  } else {
    userId = new mongoose.Types.ObjectId(userId);
  }
  const [postList] = await Post.getFeed(
    {
      createdBy: userId,
      ...req.query,
    },
    req.user
  );
  res.send(postList);
};

const likePost = async (req: any, res: Response) => {
  const { postId, key } = req.body;
  const userId = req.user._id;
  const options: any = {};
  if (key == 1) {
    options['$addToSet'] = { likes: userId };
  } else if (key == -1) {
    options['$pull'] = { likes: userId };
  } else {
    throw new BadRequestError('Invalid key');
  }
  const post = await Post.findByIdAndUpdate(postId, options);
  if (!post) {
    throw new NotFoundError('Post not found');
  }
  const [postInfo] = await Post.getPostInfo(post._id, req.user);
  res.status(200).send(postInfo);
};

const deletePost = async (req: any, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new BadRequestError('Post not found');
  }
  if (!req.user._id.equals(post.createdBy)) {
    throw new BadRequestError('Post not created by user');
  }
  await Comment.deleteMany({ postId });
  await Post.findByIdAndDelete(postId);
  res.send('Successfully Deleted');
};

export {
  addPost,
  getPost,
  getUserPosts,
  getFeed,
  likePost,
  deletePost,
  getExplore,
};
