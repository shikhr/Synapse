interface ICreatedBy {
  _id: string;
  username: string;
  avatarId: string;
  displayName: string;
}

interface IPostData {
  _id: string;
  createdAt: string;
  createdBy: ICreatedBy;
  description: string;
  hasLiked: boolean;
  likesCount: number;
  commentsCount: number;
  media: string[];
  followExists: boolean;
}

export type { ICreatedBy, IPostData };
