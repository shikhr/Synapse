import e, { Request, Response } from 'express';
import mongoose, { ObjectId, Schema } from 'mongoose';
import { BadRequestError } from '../errors/errors.js';
import Bookmark from '../models/Bookmark.js';

const addRemoveBookmark = async (req: any, res: Response) => {
  let { postId } = req.params;

  if (!mongoose.isValidObjectId(postId)) {
    throw new BadRequestError('post id invalid');
  } else {
    postId = new mongoose.Types.ObjectId(postId);
  }
  const bookmark = await Bookmark.findOne({ postId, createdBy: req.user._id });
  if (bookmark) {
    await Bookmark.findByIdAndDelete(bookmark._id);
    res.status(201).send('bookmark removed');
    return;
  }
  await Bookmark.create({ postId, createdBy: req.user._id });
  res.status(201).send('bookmark added');
};

const getBookmarkList = async (req: any, res: Response) => {
  const list = await Bookmark.getBookmarkList({
    page: req.query.page || 1,
    userId: req.user._id,
  });
  res.status(200).send(list);
};

export { addRemoveBookmark, getBookmarkList };
