import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { formatDistanceToNowStrict } from 'date-fns';
import { IconContext } from 'react-icons';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ICommentData } from '../../types/Comment.types';
import { numberFormatCompact } from '../../utils/numbers';
import Avatar from '../Avatar/Avatar';
import KebabMenu from '../Post/KebabMenu';
import PostIiconContainer from '../Post/PostIconContainer';

interface CommentCardProps {
  id: string;
}

const CommentCard = ({ id }: CommentCardProps) => {
  const { authFetch } = useAppContext();

  const fetchComment = async ({
    queryKey,
  }: QueryFunctionContext): Promise<ICommentData> => {
    const postId = queryKey[1];
    const { data } = await authFetch.get(`/comments/${postId}`);
    return data;
  };

  const {
    data: comment,
    isLoading,
    isError,
  } = useQuery(['comment', id], fetchComment, {
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>error</div>;
  }
  return (
    <div className="grid grid-rows-auto grid-cols-[auto_1fr] place-items-center w-full text-text-primary-dark gap-x-4 gap-y-3 px-4 py-4 border-b border-text-secondary-dark">
      <Link
        to={`/profile/${comment.createdBy._id}`}
        className="col-start-1 aspect-square w-auto h-14 text-5xl"
      >
        <Avatar sourceId={comment.createdBy.avatarId} />
      </Link>

      <div className="col-start-2 w-full flex flex-col justify-start">
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

      <div className="text-text-secondary-dark py-2">
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
            }}
            color={`${comment.hasLiked && 'text-red-600'} hover:text-red-600`}
          >
            {comment.hasLiked && <BsHeartFill />}
            {!comment.hasLiked && <BsHeart />}
            <span>{numberFormatCompact(comment.likesCount)}</span>
          </PostIiconContainer>
        </IconContext.Provider>
      </div>

      <div className="w-full">
        <p className="text-base">{comment.content}</p>
      </div>
    </div>
  );
};
export default CommentCard;
