import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import useFollowUser from '../../hooks/useFollowUser';
import { ICreatedBy } from '../../types/Post.types';
import PostPopupItem from './PostPopupItem';

interface PostPopupProps {
  postId: string;
  createdBy: ICreatedBy;
  followExists: boolean;
}

const PostPopup = ({ postId, createdBy, followExists }: PostPopupProps) => {
  const { authFetch, user } = useAppContext();
  const queryClient = useQueryClient();

  const deletePostHandler = async (id: string) => {
    return await authFetch.delete(`/posts/${id}`);
  };
  const { mutate: deletePost } = useMutation(deletePostHandler, {
    onSuccess(data, variables, context) {
      queryClient.removeQueries(['post', postId]);
      queryClient.invalidateQueries(['feed']);
      console.log(data.data);
    },
  });

  const { followAction, isFollowError, isFollowLoading } = useFollowUser();

  return (
    <div className="flex flex-col">
      {createdBy._id === user?._id && (
        <PostPopupItem onClick={() => deletePost(postId)}>
          <span>Delete</span>
        </PostPopupItem>
      )}
      {createdBy._id !== user?._id && (
        <PostPopupItem
          onClick={() => {
            if (isFollowLoading) return;
            followAction(
              {
                id: createdBy._id,
                action: followExists ? 'unfollow' : 'follow',
              },
              {
                onSettled(data, error, variables, context) {
                  queryClient.invalidateQueries(['post', postId]);
                },
              }
            );
          }}
        >
          <span>
            {followExists ? 'Unfollow' : 'Follow'} @{createdBy.username}
          </span>
        </PostPopupItem>
      )}
      <PostPopupItem onClick={() => {}}>
        <span>Report</span>
      </PostPopupItem>
    </div>
  );
};
export default PostPopup;
