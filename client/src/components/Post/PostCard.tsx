import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import PostImages from './PostImages';
import KebabMenu from './KebabMenu';
import React from 'react';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import useFetchPost from '../../hooks/useFetchPost';
import PostActionBar from './PostActionBar';
import PostPopup from './PostPopup';
import DisplayError from '../Errrors/DisplayError';

interface PostCardProps {
  id: string;
}

const PostCard = ({ id }: PostCardProps) => {
  const navigate = useNavigate();

  const { data: post, isLoading, isError, error, refetch } = useFetchPost(id);

  const openFullPost = (id: string) => {
    navigate(`/post/${id}`);
  };

  if (isLoading) {
    return <PostLoadingSkeleton />;
  }
  if (isError) {
    return (
      <div className="w-full flex h-52 justify-center items-center border-b border-text-secondary-dark">
        <DisplayError refetch={refetch} error={error} />
      </div>
    );
  }

  return (
    <div
      onClick={() => openFullPost(post._id)}
      className="flex items-start gap-3 px-3 py-4 hover:bg-opacity-20 duration-300 hover:bg-background-overlay-dark border-b border-text-secondary-dark cursor-pointer transition-colors"
    >
      <Link
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        to={`/profile/${post.createdBy._id}`}
        className="aspect-square shrink-0 basis-14 text-5xl"
      >
        <Avatar sourceId={post.createdBy.avatarId} />
      </Link>

      <div className="basis-full flex flex-col text-text-primary-dark overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="flex flex-col justify-start overflow-hidden"
          >
            <Link
              to={`/profile/${post.createdBy._id}`}
              className="flex w-full gap-2 items-center justify-start"
            >
              <span className="font-bold overflow-hidden overflow-ellipsis">
                {post.createdBy.displayName}
              </span>
              <span className="text-text-secondary-dark text-sm font-semibold">
                @{post.createdBy.username}
              </span>
            </Link>
            <span className="text-text-secondary-dark text-sm font-semibold">
              {formatDistanceToNowStrict(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <KebabMenu>
            <PostPopup
              createdBy={post.createdBy}
              postId={post._id}
              followExists={post.followExists}
              closeMenu={undefined as never}
            />
          </KebabMenu>
        </div>

        <div className="flex flex-col">
          <p className="text-base">{post.description}</p>
          {post.media.length > 0 && <PostImages media={post.media} />}
        </div>

        <div className="flex w-full pr-1 max-w-lg justify-between items-center mt-6 text-text-secondary-dark">
          <PostActionBar post={post} />
        </div>
      </div>
    </div>
  );
};
export default PostCard;
