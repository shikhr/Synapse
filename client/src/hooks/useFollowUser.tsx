import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';

const useFollowUser = () => {
  const { authFetch } = useAppContext();

  const followHandler = async ({
    id,
    action,
  }: {
    id: string;
    action: string;
  }) => {
    return await authFetch.put(`/users/${action}/${id}`);
  };

  const {
    mutate: followAction,
    isLoading: isFollowLoading,
    isError: isFollowError,
  } = useMutation(followHandler);

  return { followAction, isFollowError, isFollowLoading };
};
export default useFollowUser;
