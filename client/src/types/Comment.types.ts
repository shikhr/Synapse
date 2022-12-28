import { ICreatedBy } from './Post.types';

interface ICommentData {
  _id: string;
  createdAt: string;
  createdBy: ICreatedBy;
  content: string;
  hasLiked: boolean;
  likesCount: number;
}

export type { ICreatedBy, ICommentData };
