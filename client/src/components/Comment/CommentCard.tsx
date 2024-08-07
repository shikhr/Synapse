import {
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { formatDistanceToNowStrict } from 'date-fns';
import { motion } from 'framer-motion';
import { IconContext } from 'react-icons';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ICommentData } from '../../types/Comment.types';
import { numberFormatCompact } from '../../utils/numbers';
import Avatar from '../Avatar/Avatar';
import ErrorWithRefetch from '../Errrors/ErrorWithRefetch';
import FadeInView from '../MotionWrapper/FadeInView';
import KebabMenu from '../KebabMenu/KebabMenu';
import PostIiconContainer from '../Post/PostIconContainer';
import CommentLoadingSkeleton from '../Skeletons/CommentLoadingSkeleton';
import CommentPopup from './CommentPopup';

interface CommentCardProps {
  id: string;
  postId: string;
}

const CommentCard = ({ id, postId }: CommentCardProps) => {
  const { authFetch } = useAppContext();
  const queryClient = useQueryClient();

  const fetchComment = async ({
    queryKey,
  }: QueryFunctionContext): Promise<ICommentData> => {
    const commentId = queryKey[1];
    const { data } = await authFetch.get(`/comments/${commentId}`);
    return data;
  };

  const {
    data: comment,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['comment', id],
    queryFn: fetchComment,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  const likeCommentHandler = async (data: {
    commentId: string;
    key: string;
  }) => {
    return await authFetch.put('/comments/like', data);
  };

  const { mutate: likeComment } = useMutation({
    mutationFn: likeCommentHandler,

    onMutate: async ({ key, commentId }) => {
      await queryClient.cancelQueries({
        queryKey: ['comment', commentId],
      });
      const prevPostData = queryClient.getQueryData(['comment', commentId]);
      queryClient.setQueryData(['comment', commentId], (oldQueryData: any) => {
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

    onError: (error, { key, commentId }, context) => {
      queryClient.setQueryData(['comment', commentId], context?.prevPostData);
    },

    onSettled: (data, error, { key, commentId }, context) => {
      queryClient.invalidateQueries({
        queryKey: ['comment', commentId],
      });
    },
  });

  if (isPending) {
    return <CommentLoadingSkeleton />;
  }
  if (isError) {
    return (
      <div className="border-b border-text-secondary-dark px-2 py-4">
        <ErrorWithRefetch refetch={refetch} />
      </div>
    );
  }
  return (
    <FadeInView className="grid grid-rows-auto grid-cols-[auto_1fr] place-items-center w-full min-w-0 text-text-primary-dark gap-x-4 gap-y-3 px-4 py-4 border-b border-text-secondary-dark">
      <Link
        to={`/profile/${comment.createdBy._id}`}
        className="col-start-1 aspect-square w-auto h-14 text-5xl"
      >
        <Avatar sourceId={comment.createdBy.avatarId} />
      </Link>

      <div className="col-start-2 w-full flex justify-between">
        <div className="flex flex-col justify-start">
          <Link
            to={`/profile/${comment.createdBy._id}`}
            className="flex gap-2 items-center justify-start"
          >
            <span className="font-bold">{comment.createdBy.displayName}</span>
            <span className="text-text-secondary-dark text-sm font-semibold">
              @{comment.createdBy.username}
            </span>
          </Link>
          <span className="text-text-secondary-dark text-sm font-semibold">
            {formatDistanceToNowStrict(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <KebabMenu>
          <CommentPopup
            commentId={comment._id}
            createdBy={comment.createdBy}
            closeMenu={undefined as never}
            postId={postId}
          />
        </KebabMenu>
      </div>

      <div className="text-text-secondary-dark py-2 mb-auto">
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
              let key = comment.hasLiked ? '-1' : '1';
              likeComment({ commentId: comment._id, key });
            }}
            color={`${comment.hasLiked && 'text-red-600'} hover:text-red-600`}
          >
            {comment.hasLiked && <BsHeartFill />}
            {!comment.hasLiked && <BsHeart />}
            <span>{numberFormatCompact(comment.likesCount)}</span>
          </PostIiconContainer>
        </IconContext.Provider>
      </div>

      <div className="min-w-0 w-full">
        <p className="text-base break-words">{comment.content}</p>
      </div>
    </FadeInView>
  );
};
export default CommentCard;
