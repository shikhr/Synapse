import mongoose from 'mongoose';
import { bootstrapModels } from '@synapse/models';

const { User, Post, Comment, Bookmark, Avatar, Notification } =
  bootstrapModels();

export { User, Post, Comment, Bookmark, Avatar, Notification };
export type { EntityRef } from '@synapse/models';
