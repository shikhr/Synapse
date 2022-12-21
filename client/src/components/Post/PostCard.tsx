import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  useQuery,
} from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Avatar from '../Avatar/Avatar';
import { BsHeart, BsHeartFill, BsThreeDots } from 'react-icons/bs';
import { FaHeart, FaCommentAlt, FaBookmark, FaShare } from 'react-icons/fa';
import PostIiconContainer from './PostIconContainer';
import { formatDistanceToNowStrict } from 'date-fns';
import PostImages from './PostImages';
import KebabMenu from './KebabMenu';
import { IPostData } from '../../types/Post.types';

interface PostCardProps {
  id: string;
}

const PostCard = ({ id }: PostCardProps) => {
  const { authFetch, user } = useAppContext();
  const fetchPost = async ({
    queryKey,
  }: QueryFunctionContext): Promise<IPostData> => {
    const postId = queryKey[1];
    const { data } = await authFetch.get(`/posts/${postId}`);
    return data[0];
  };

  const {
    data: post,
    isLoading,
    isError,
    status,
    error,
    isSuccess,
  } = useQuery(['post', id], fetchPost, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div></div>;
  }

  return (
    <div className="flex items-start gap-3 px-3 py-4 hover:bg-opacity-20 duration-300 hover:bg-background-overlay-dark border-b border-text-secondary-dark cursor-pointer transition-colors">
      <Link
        to={`/profile/${post.createdBy._id}`}
        className="aspect-square shrink-0 basis-14 text-5xl"
      >
        <Avatar sourceId={post.createdBy.avatarId} />
      </Link>

      <div className="basis-full flex flex-col text-text-primary-dark">
        <div className="flex items-center justify-between w-full">
          <div onClick={() => {}} className="flex flex-col justify-start">
            <Link
              to={`/profile/${post.createdBy._id}`}
              className="flex gap-2 items-center justify-start"
            >
              <span className="font-bold">{post.createdBy.displayName}</span>
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
          <KebabMenu
            createdBy={post.createdBy}
            postId={post._id}
            followExists={post.followExists}
          />
        </div>

        <div className="flex flex-col">
          <div>{post.description}</div>
          {post.media.length > 0 && <PostImages media={post.media} />}
        </div>

        <div className="flex w-full pr-1 max-w-lg justify-between text-sm sm:text-base pt-6 text-text-secondary-dark">
          <PostIiconContainer
            onClick={() => {}}
            color={`${post.hasLiked && 'text-red-600'} hover:text-red-600`}
          >
            {post.hasLiked && <BsHeartFill />}
            {!post.hasLiked && <BsHeart />}
            <span>{post.likesCount}</span>
          </PostIiconContainer>
          <PostIiconContainer onClick={() => {}} color="hover:text-primary-100">
            <FaCommentAlt />
            <span>800</span>
          </PostIiconContainer>
          <PostIiconContainer onClick={() => {}} color="hover:text-primary-100">
            <FaBookmark />
            <span className="hidden xs:block">Save</span>
          </PostIiconContainer>
          <PostIiconContainer onClick={() => {}} color="hover:text-primary-100">
            <FaShare />
          </PostIiconContainer>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
