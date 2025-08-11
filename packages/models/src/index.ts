import User from './schemas/User.js';
import Post from './schemas/Post.js';
import Comment from './schemas/Comments.js';
import Bookmark from './schemas/Bookmark.js';
import Avatar from './schemas/Avatar.js';
import Notification from './schemas/Notification.js';

export function bootstrapModels(): {
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  Bookmark: typeof Bookmark;
  Avatar: typeof Avatar;
  Notification: typeof Notification;
} {
  // Importing the files already registers the models on the default mongoose instance.
  return { User, Post, Comment, Bookmark, Avatar, Notification };
}

export { User, Post, Comment, Bookmark, Avatar, Notification };
export type { EntityRef } from './schemas/Notification.js';
