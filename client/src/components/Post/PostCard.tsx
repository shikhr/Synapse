import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import { formatDistanceToNowStrict } from 'date-fns';
import PostImages from './PostImages';
import KebabMenu from '../KebabMenu/KebabMenu';
import React from 'react';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import useFetchPost from '../../hooks/useFetchPost';
import PostActionBar from './PostActionBar';
import PostPopup from './PostPopup';
import DisplayError from '../Errrors/DisplayError';
import { motion } from 'framer-motion';
import FadeInView from '../MotionWrapper/FadeInView';

interface PostCardProps {
  id: string;
}

const PostCard = ({ id }: PostCardProps) => {
  const navigate = useNavigate();

  const { data: post, isPending, isError, error, refetch } = useFetchPost(id);

  const openFullPost = (id: string) => {
    navigate(`/post/${id}`);
  };

  if (isPending) {
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
    <FadeInView
      onClick={() => openFullPost(post._id)}
      className="flex items-start gap-3 px-3 py-4 duration-300 hover:bg-background-overlay-dark/30 border-b border-text-secondary-dark cursor-pointer transition-colors"
    >
      <Link
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        to={`/profile/${post.createdBy._id}`}
        className="aspect-square shrink-0 basis-14 text-5xl"
      >
        <Avatar sourceId={post.createdBy.avatarId} />
      </Link>

      <div className="basis-full flex flex-col text-text-primary-dark min-w-0">
        <div className="flex items-center justify-between w-full">
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="flex flex-col justify-start overflow-hidden"
          >
            <Link
              to={`/profile/${post.createdBy._id}`}
              className="flex w-full gap-2 items-center justify-start"
            >
              <span className="font-bold overflow-hidden text-ellipsis">
                {post.createdBy.displayName}
              </span>
              <span className="text-text-secondary-dark text-sm font-semibold overflow-hidden text-ellipsis">
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

        <div className="flex flex-col w-full">
          <p className="text-base break-words">{post.description}</p>
          {post.media.length > 0 && <PostImages media={post.media} />}
        </div>

        <div className="flex w-full pr-1 max-w-lg justify-between items-center mt-6 text-text-secondary-dark">
          <PostActionBar post={post} />
        </div>
      </div>
    </FadeInView>
  );
};
export default PostCard;
