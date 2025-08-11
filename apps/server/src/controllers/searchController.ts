import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { Comment, Post, User } from '../models/index.js';
import { BadRequestError } from '../errors/errors.js';

const search = async (req: any, res: Response) => {
  const { q, type = 'all', page = 1 } = req.query;
  if (!q) {
    throw new BadRequestError('Search query is required');
  }

  let results;

  switch (type) {
    case 'users':
      results = await User.searchUsers(q, page, req.user._id);
      break;
    case 'posts':
      results = await Post.searchPosts(q, page, req.user);
      break;
    case 'comments':
      results = await Comment.searchComments(q, page, req.user);
      break;
    default:
      throw new BadRequestError('Invalid search type');
  }

  res.send(results);
};

export { search };
