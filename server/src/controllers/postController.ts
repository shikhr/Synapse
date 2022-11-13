import { Response } from 'express';
import { BadRequestError } from '../errors/errors.js';
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
  res.send({
    post: await post.getPostInfo(user._id),
  });
};

const getPost = async (req: any, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  const fullPost = await post?.getPostInfo(req.user._id);

  res.status(200).send(fullPost);
};

const getFeed = async (req: any, res: Response) => {
  const feed = await Post.getFeed(req.user._id);

  res.status(200).send(feed);
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
  const postInfo = await post?.getPostInfo(req.user._id);
  res.status(200).send(postInfo);
};

export { addPost, getPost, getFeed, likePost };
