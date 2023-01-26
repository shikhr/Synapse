import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { BadRequestError, NotFoundError } from '../errors/errors.js';
import Avatar from '../models/Avatar.js';
import User from '../models/User.js';

const getProfile = async (req: any, res: Response) => {
  let id = req.params.id === 'me' ? req.user._id : req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    throw new NotFoundError('No user found');
  } else {
    id = new mongoose.Types.ObjectId(id);
  }
  const [userProfile] = await User.getFullProfile(id, req.user._id);
  if (!userProfile) {
    throw new NotFoundError('No user found');
  }

  res.send(userProfile);
};

const updateProfile = async (req: any, res: Response) => {
  const updateBody = req.body;
  const updateKeys = ['bio', 'website', 'birthDate', 'location'];
  const user = req.user;
  if (req.file) {
    const avatarBuffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const avatar = await Avatar.create({ data: avatarBuffer });
    if (user.avatarId) {
      await Avatar.findByIdAndDelete(user.avatarId);
    }
    user.avatarId = avatar._id;
  }
  if (updateBody.displayName) {
    user.displayName = updateBody.displayName;
  }
  updateKeys.forEach((key) => {
    if (updateBody[key] !== undefined) {
      if (updateBody[key] === '') {
        user[key] = undefined;
      } else {
        user[key] = updateBody[key];
      }
    }
  });

  await user.save();
  res.send(user.getUserProfile());
};

const followUser = async (req: any, res: Response) => {
  const { followId } = req.params;
  const user = req.user;
  if (followId === user._id.toString()) {
    throw new BadRequestError('Cannot follow yourself.');
  }

  await User.findByIdAndUpdate(user._id, {
    $addToSet: { following: followId },
  });
  const followedUser = await User.findByIdAndUpdate(
    followId,
    { $addToSet: { followers: user._id } },
    { new: true }
  );

  if (!followedUser) {
    throw new BadRequestError('User not found');
  }
  res.status(200).send('User followed');
};

const unfollowUser = async (req: any, res: Response) => {
  const { unfollowId } = req.params;
  const user = req.user;
  if (unfollowId === user._id.toString()) {
    throw new BadRequestError('Cannot follow yourself.');
  }

  await User.findByIdAndUpdate(user._id, {
    $pull: { following: unfollowId },
  });
  const unfollowedUser = await User.findByIdAndUpdate(
    unfollowId,
    { $pull: { followers: user._id } },
    { new: true }
  );

  if (!unfollowedUser) {
    throw new BadRequestError('User not found');
  }
  res.status(200).send('User unfollowed');
};

const getFollowSuggestions = async (req: any, res: Response) => {
  const followList = await User.aggregate([
    {
      $set: {
        followExists: { $in: [req.user._id, '$followers'] },
      },
    },
    { $match: { followExists: false, _id: { $ne: req.user._id } } },
    { $sort: { followers: -1 } },
    { $limit: 6 },
    {
      $project: {
        username: 1,
        displayName: 1,
        avatarId: 1,
        followExists: 1,
      },
    },
  ]);

  res.send(followList);
};

const getFollowers = async (req: any, res: Response) => {
  let id = req.params.id === 'me' ? req.user._id : req.params.id;
  const { page = 1 } = req.query;
  const size = 10;
  if (!mongoose.isValidObjectId(id)) {
    throw new NotFoundError('No user found');
  } else {
    id = new mongoose.Types.ObjectId(id);
  }

  const [followers] = await User.aggregate([
    { $match: { $expr: { $in: [id, '$following'] } } },
    {
      $set: {
        followExists: { $in: [req.user._id, '$followers'] },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        displayName: 1,
        avatarId: 1,
        followExists: 1,
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * size }, { $limit: size }],
        meta: [
          {
            $count: 'count',
          },
          {
            $addFields: {
              currentPage: Number(page),
              hasMorePages: { $gt: ['$count', Number(page) * size] },
              totalPages: { $ceil: { $divide: ['$count', size] } },
            },
          },
          {
            $project: {
              currentPage: 1,
              hasMorePages: 1,
              totalPages: 1,
            },
          },
        ],
      },
    },
    {
      $set: {
        meta: { $first: '$meta' },
      },
    },
  ]);

  res.send(followers);
};

const getFollowing = async (req: any, res: Response) => {
  let id = req.params.id === 'me' ? req.user._id : req.params.id;
  const { page = 1 } = req.query;
  const size = 10;

  if (!mongoose.isValidObjectId(id)) {
    throw new NotFoundError('No user found');
  } else {
    id = new mongoose.Types.ObjectId(id);
  }
  const [following] = await User.aggregate([
    { $match: { $expr: { $in: [id, '$followers'] } } },
    {
      $set: {
        followExists: { $in: [req.user._id, '$followers'] },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        displayName: 1,
        avatarId: 1,
        followExists: 1,
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * size }, { $limit: size }],
        meta: [
          {
            $count: 'count',
          },
          {
            $addFields: {
              currentPage: Number(page),
              hasMorePages: { $gt: ['$count', Number(page) * size] },
              totalPages: { $ceil: { $divide: ['$count', size] } },
            },
          },
          {
            $project: {
              currentPage: 1,
              hasMorePages: 1,
              totalPages: 1,
            },
          },
        ],
      },
    },
    {
      $set: {
        meta: { $first: '$meta' },
      },
    },
  ]);

  res.send(following);
};

const getAvatar = async (req: any, res: Response) => {
  const { avatarId } = req.params;
  const avatar = await Avatar.findById(avatarId);
  if (!avatar) {
    throw new NotFoundError('Cannot get resource');
  }
  res.set('Content-Type', 'image/png');
  res.status(StatusCodes.CREATED).send(avatar.data);
};

const postAvatar = async (req: any, res: Response) => {
  const avatarBuffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  const avatar = await Avatar.create({ data: avatarBuffer });
  if (req.user.avatarId) {
    await Avatar.findByIdAndDelete(req.user.avatarId);
  }
  req.user.avatarId = avatar._id;
  await req.user.save();
  res.set('Content-Type', 'image/png');
  res.status(StatusCodes.CREATED).send(avatar.data);
};

const deleteAvatar = async (req: any, res: Response) => {
  await Avatar.findByIdAndDelete(req.user.avatarId);
  req.user.avatarId = undefined;
  await req.user.save();
  res.status(StatusCodes.OK).send({ msg: 'avatar deleted' });
};

export {
  followUser,
  unfollowUser,
  getProfile,
  updateProfile,
  getAvatar,
  postAvatar,
  getFollowers,
  getFollowing,
  deleteAvatar,
  getFollowSuggestions,
};
