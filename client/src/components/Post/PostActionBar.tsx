import { IconContext } from 'react-icons';
import { IPostData } from '../../types/Post.types';
import {
  BsBookmark,
  BsBookmarkFill,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs';
import { FaCommentAlt, FaBookmark, FaShare } from 'react-icons/fa';
import PostIiconContainer from './PostIconContainer';
import { useAppContext } from '../../context/AppContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { numberFormatCompact } from '../../utils/numbers';

interface PostActionBarProps {
  post: IPostData;
}

const PostActionBar = ({ post }: PostActionBarProps) => {
  const { authFetch } = useAppContext();
  const queryClient = useQueryClient();

  const likePostHandler = async (data: { postId: string; key: string }) => {
    return authFetch.put('/posts/like', data);
  };

  const bookmarkPostHandler = async ({ postId }: { postId: string }) => {
    return authFetch.post(`/bookmarks/${postId}`);
  };

  const { mutate: likePost } = useMutation(likePostHandler, {
    onMutate: async ({ key, postId }) => {
      await queryClient.cancelQueries(['post', postId]);
      const prevPostData = queryClient.getQueryData(['post', postId]);
      queryClient.setQueryData(['post', postId], (oldQueryData: any) => {
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
    onError: (error, { key, postId }, context) => {
      queryClient.setQueryData(['post', postId], context?.prevPostData);
    },
    onSettled: (data, error, { key, postId }, context) => {
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const { mutate: bookmarkPost } = useMutation(bookmarkPostHandler, {
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries(['post', postId]);
      const prevPostData = queryClient.getQueryData(['post', postId]);
      queryClient.setQueryData(['post', postId], (oldQueryData: any) => {
        return {
          ...oldQueryData,
          hasBookmarked: !oldQueryData.hasBookmarked,
        };
      });
      return { prevPostData };
    },
    onError: (error, { postId }, context) => {
      queryClient.setQueryData(['post', postId], context?.prevPostData);
    },
    onSettled: (data, error, { postId }, context) => {
      queryClient.invalidateQueries(['post', postId]);
      queryClient.invalidateQueries(['bookmarks']);
    },
  });

  return (
    <IconContext.Provider
      value={{
        style: {
          verticalAlign: 'bottom',
        },
      }}
    >
      <PostIiconContainer
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          let key = post.hasLiked ? '-1' : '1';
          likePost({ postId: post._id, key });
        }}
        color={`${
          post.hasLiked && 'text-red-600'
        } hover:text-red-600 xs:flex-1`}
      >
        {post.hasLiked && <BsHeartFill />}
        {!post.hasLiked && <BsHeart />}
        <span>{numberFormatCompact(post.likesCount)}</span>
      </PostIiconContainer>
      <PostIiconContainer
        onClick={() => {}}
        color="hover:text-primary-100 xs:flex-1"
      >
        <FaCommentAlt />
        <span>{numberFormatCompact(post.commentsCount)}</span>
      </PostIiconContainer>
      <PostIiconContainer
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          bookmarkPost({ postId: post._id });
        }}
        color={`${
          post.hasBookmarked && 'text-primary-100'
        } hover:text-primary-100 xs:flex-1`}
      >
        {post.hasBookmarked && <BsBookmarkFill />}
        {!post.hasBookmarked && <BsBookmark />}
        <span className="hidden xs:block capitalize">
          {post.hasBookmarked ? 'saved' : 'save'}
        </span>
      </PostIiconContainer>
      <PostIiconContainer
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
        }}
        color="hover:text-primary-100 flex-0"
      >
        <FaShare />
      </PostIiconContainer>
    </IconContext.Provider>
  );
};
export default PostActionBar;
