import mongoose from 'mongoose';
import { bootstrapModels } from '@synapse/models/index';

const { User, Post, Comment, Bookmark, Avatar, Notification } =
  bootstrapModels();

export { User, Post, Comment, Bookmark, Avatar, Notification };
export type { EntityRef } from '@synapse/models/index';
