import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useFollowUser from '../../hooks/useFollowUser';
import { ICreatedBy } from '../../types/Post.types';
import PopupItem from '../KebabMenu/PopupItem';

interface PostPopupProps {
  postId: string;
  createdBy: ICreatedBy;
  followExists: boolean;
  closeMenu: () => void;
}

const PostPopup = ({
  postId,
  createdBy,
  followExists,
  closeMenu,
}: PostPopupProps) => {
  const { authFetch, user } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deletePostHandler = async (id: string) => {
    return await authFetch.delete(`/posts/${id}`);
  };
  const { mutate: deletePost } = useMutation({
    mutationFn: deletePostHandler,
  });

  const { followAction, isFollowError, isFollowLoading } = useFollowUser();

  return (
    <div className="flex flex-col">
      {createdBy._id === user?._id && (
        <PopupItem
          onClick={() => {
            deletePost(postId);
            closeMenu();
          }}
        >
          <span>Delete</span>
        </PopupItem>
      )}
      {createdBy._id !== user?._id && (
        <>
          <PopupItem
            onClick={() => {
              if (isFollowLoading) return;
              followAction(
                {
                  id: createdBy._id,
                  action: followExists ? 'unfollow' : 'follow',
                },
                {
                  onSettled(data, error, variables, context) {
                    queryClient.invalidateQueries({
                      queryKey: ['post', postId],
                    });
                  },
                }
              );
              closeMenu();
            }}
          >
            <span>
              {followExists ? 'Unfollow' : 'Follow'} @{createdBy.username}
            </span>
          </PopupItem>
          <PopupItem
            onClick={() => {
              closeMenu();
            }}
          >
            <span>Block @{createdBy.username}</span>
          </PopupItem>
        </>
      )}
      <PopupItem
        onClick={() => {
          closeMenu();
        }}
      >
        <span>Report</span>
      </PopupItem>
    </div>
  );
};
export default PostPopup;
