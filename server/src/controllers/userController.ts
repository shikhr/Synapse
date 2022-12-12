import { Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/errors.js';
import User from '../models/User.js';

// TODO:
const getProfile = async (req: any, res: Response) => {
  const id = req.params.id === 'me' ? req.user._id : req.params.id;

  const user = await User.findById(id);
  if (!user) {
    throw new BadRequestError('No user found');
  }
  const userProfile = await user.getFullProfile(req.user._id);

  res.send(userProfile);
};

const updateProfile = () => {};

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
  res.status(200).send(followedUser);
};

const unfollowUser = async (req: any, res: Response) => {
  const { unfollowId } = req.params;
  const user = req.user;
  if (unfollowId === user._id.toString()) {
    throw new BadRequestError('Cannot follow yourself.');
  }

  await User.findByIdAndUpdate(user._id, {
    $pull: { follwing: unfollowId },
  });
  const unfollowedUser = await User.findByIdAndUpdate(
    unfollowId,
    { $pull: { followers: user._id } },
    { new: true }
  );

  if (!unfollowedUser) {
    throw new BadRequestError('User not found');
  }
  res.status(200).send(unfollowedUser);
};

const getAvatar = async (req: any, res: Response) => {};

const postAvatar = async (req: any, res: Response) => {};

const deleteAvatar = async (req: any, res: Response) => {};

export {
  followUser,
  unfollowUser,
  getProfile,
  updateProfile,
  getAvatar,
  postAvatar,
  deleteAvatar,
};
