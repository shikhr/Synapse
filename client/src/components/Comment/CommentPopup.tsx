import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ICreatedBy } from '../../types/Post.types';
import PopupItem from '../KebabMenu/PopupItem';

interface CommentPopupProps {
  commentId: string;
  postId: string;
  createdBy: ICreatedBy;
  closeMenu: () => void;
}

const CommentPopup = ({
  commentId,
  createdBy,
  postId,
  closeMenu,
}: CommentPopupProps) => {
  const { authFetch, user } = useAppContext();
  const queryClient = useQueryClient();

  const deleteCommentHandler = async (id: string) => {
    return await authFetch.delete(`/comments/${id}`);
  };
  const { mutate: deleteComment } = useMutation(deleteCommentHandler, {
    onSuccess(data, variables, context) {
      queryClient.removeQueries(['comment', commentId]);
      queryClient.invalidateQueries(['commentList', postId]);
    },
  });

  return (
    <div className="flex flex-col">
      {createdBy._id === user?._id && (
        <PopupItem
          onClick={() => {
            deleteComment(commentId);
            closeMenu();
          }}
        >
          <span>Delete</span>
        </PopupItem>
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
export default CommentPopup;
