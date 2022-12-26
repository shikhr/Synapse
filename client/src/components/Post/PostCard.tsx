import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Avatar from '../Avatar/Avatar';
import { BsHeart, BsHeartFill, BsThreeDots } from 'react-icons/bs';
import { FaHeart, FaCommentAlt, FaBookmark, FaShare } from 'react-icons/fa';
import PostIiconContainer from './PostIconContainer';
import { formatDistanceToNowStrict } from 'date-fns';
import PostImages from './PostImages';
import KebabMenu from './KebabMenu';
import { IPostData } from '../../types/Post.types';
import React from 'react';

interface PostCardProps {
  id: string;
}

const PostCard = ({ id }: PostCardProps) => {
  const { authFetch } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchPost = async ({
    queryKey,
  }: QueryFunctionContext): Promise<IPostData> => {
    const postId = queryKey[1];
    const { data } = await authFetch.get(`/posts/${postId}`);
    return data;
  };

  const likePostHandler = async (data: { postId: string; key: string }) => {
    return await authFetch.put('/posts/like', data);
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

  const { mutate: likePost } = useMutation(likePostHandler, {
    onMutate: async ({ key, postId }) => {
      await queryClient.cancelQueries(['post', id]);
      const prevPostData = queryClient.getQueryData(['post', id]);
      queryClient.setQueryData(['post', id], (oldQueryData: any) => {
        return {
          ...oldQueryData,
          likesCount:
            key === '1'
              ? oldQueryData.likesCount + 1
              : oldQueryData.likesCount - 1,
          hasLiked: key === '1' ? true : false,
        };
      });
      return { prevPostData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['post', id], context?.prevPostData);
      console.log({ error, variables, context });
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries(['post', id]);
    },
  });

  const openFullPost = (id: string) => {
    navigate(`/post/${id}`);
  };

  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div></div>;
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

      <div className="basis-full flex flex-col text-text-primary-dark">
        <div className="flex items-center justify-between w-full">
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="flex flex-col justify-start"
          >
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

        <div
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="flex w-full pr-1 max-w-lg justify-between text-sm sm:text-base pt-6 text-text-secondary-dark"
        >
          <PostIiconContainer
            onClick={() => {
              let key = post.hasLiked ? '-1' : '1';
              likePost({ postId: post._id, key });
            }}
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
