import { format } from 'date-fns';
import { BsDot } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import useFetchPost from '../../hooks/useFetchPost';
import Avatar from '../Avatar/Avatar';
import CommentList from '../Comment/CommentList';
import DisplayError from '../Errrors/DisplayError';
import AddCommentForm from '../Forms/AddCommentForm';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import KebabMenu from './KebabMenu';
import PostActionBar from './PostActionBar';
import PostImages from './PostImages';
import PostPopup from './PostPopup';

const FullPost = () => {
  const { postId } = useParams();
  if (!postId) {
    return <div>error</div>;
  }

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchPost(postId);

  return (
    <div>
      <DynamicNavTitle title="Post" />
      {isLoading && <PostLoadingSkeleton />}
      {isError && (
        <div className="w-full flex h-52 justify-center items-center text-text-secondary-dark">
          <DisplayError refetch={refetch} error={error} />
        </div>
      )}
      {post && (
        <div>
          <div className="flex flex-col items-start gap-3 px-4 py-4 text-text-primary-dark">
            <div className="w-full flex items-center gap-4 justify-between">
              <Link
                to={`/profile/${post.createdBy._id}`}
                className="aspect-square h-14 shrink-0 basis-14 text-5xl"
              >
                <Avatar sourceId={post.createdBy.avatarId} />
              </Link>
              <Link
                to={`/profile/${post.createdBy._id}`}
                className="flex flex-col justify-center"
              >
                <span className="font-semibold text-xl">
                  {post.createdBy.displayName}
                </span>
                <span className="text-text-secondary-dark text-sm font-semibold">
                  @{post.createdBy.username}
                </span>
              </Link>
              <div className="ml-auto">
                <KebabMenu>
                  <PostPopup
                    createdBy={post.createdBy}
                    postId={post._id}
                    followExists={post.followExists}
                  />
                </KebabMenu>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-2xl">{post.description}</p>
              {post.media.length > 0 && <PostImages media={post.media} />}
            </div>

            <span className="text-text-secondary-dark flex items-center text-sm font-semibold">
              <span>{format(new Date(post.createdAt), 'h:mm a')}</span>
              <BsDot />
              <span>{format(new Date(post.createdAt), 'dd MMM yyyy')}</span>
            </span>

            <div className="pt-4 w-full px-2">
              <div className="flex w-full px-2 sm:px-8 border-t border-b border-text-secondary-dark justify-between items-center py-3 text-text-secondary-dark">
                <PostActionBar post={post} />
              </div>
            </div>
          </div>
          <AddCommentForm id={post._id} />
          <CommentList id={post._id} />
        </div>
      )}
    </div>
  );
};
export default FullPost;
