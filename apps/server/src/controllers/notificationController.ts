import { Response } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/index.js';
import { NotFoundError } from '../errors/errors.js';

// GET /api/v1/notifications?page=1
const getNotifications = async (req: any, res: Response) => {
  const { page = 1 } = req.query as { page?: number };
  const size = 10;

  if (!req.user || !mongoose.isValidObjectId(req.user._id)) {
    throw new NotFoundError('User not found');
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);
  const result = await Notification.paginateForUser(userId, Number(page), size);

  res.send(
    result || {
      data: [],
      meta: { currentPage: Number(page), hasMorePages: false, totalPages: 0 },
    }
  );
};

export { getNotifications };
