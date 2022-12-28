import { IconContext } from 'react-icons';
import { IPostData } from '../../types/Post.types';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaCommentAlt, FaBookmark, FaShare } from 'react-icons/fa';
import PostIiconContainer from './PostIconContainer';
import { useAppContext } from '../../context/AppContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PostActionBarProps {
  post: IPostData;
}

const PostActionBar = ({ post }: PostActionBarProps) => {
  const { authFetch } = useAppContext();
  const queryClient = useQueryClient();

  const likePostHandler = async (data: { postId: string; key: string }) => {
    return await authFetch.put('/posts/like', data);
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

  return (
    <IconContext.Provider
      value={{
        style: {
          verticalAlign: 'bottom',
          marginTop: 3,
        },
      }}
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
        <span>{post.commentsCount}</span>
      </PostIiconContainer>
      <PostIiconContainer onClick={() => {}} color="hover:text-primary-100">
        <FaBookmark />
        <span className="hidden xs:block">Save</span>
      </PostIiconContainer>
      <PostIiconContainer onClick={() => {}} color="hover:text-primary-100">
        <FaShare />
      </PostIiconContainer>
    </IconContext.Provider>
  );
};
export default PostActionBar;
