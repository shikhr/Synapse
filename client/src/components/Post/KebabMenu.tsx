import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useAppContext } from '../../context/AppContext';
import { ICreatedBy } from '../../types/Post.types';
import PostPopup from '../UI/PostPopup';
import PostPopupItem from './PostPopupItem';

interface KebabMenuProps {
  postId: string;
  createdBy: ICreatedBy;
  followExists: boolean;
}

const KebabMenu = ({ createdBy, postId, followExists }: KebabMenuProps) => {
  const [isKebabPopupOpen, setIsKebabPopupOpen] = useState(false);
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

  return (
    <div
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      className="relative"
    >
      <div
        onClick={() => setIsKebabPopupOpen(!isKebabPopupOpen)}
        className=" text-text-secondary-dark text-lg p-2 rounded-full duration-300 hover:bg-background-overlay-dark"
      >
        <BsThreeDots />
      </div>
      {isKebabPopupOpen && (
        <div>
          <PostPopup closePopup={() => setIsKebabPopupOpen(!isKebabPopupOpen)}>
            <div className="flex flex-col">
              {createdBy._id === user?._id && (
                <PostPopupItem onClick={() => deletePost(postId)}>
                  <span>Delete</span>
                </PostPopupItem>
              )}
              {createdBy._id !== user?._id && (
                <PostPopupItem onClick={() => {}}>
                  <span>
                    {followExists ? 'Unfollow' : 'Follow'} @{createdBy.username}
                  </span>
                </PostPopupItem>
              )}
              <PostPopupItem onClick={() => {}}>
                <span>Report</span>
              </PostPopupItem>
            </div>
          </PostPopup>
        </div>
      )}
    </div>
  );
};
export default KebabMenu;
