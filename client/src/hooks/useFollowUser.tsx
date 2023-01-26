import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';

const useFollowUser = () => {
  const { authFetch, user } = useAppContext();
  const queryClient = useQueryClient();

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
  } = useMutation(followHandler, {
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries(['follow-suggestions']);
      queryClient.invalidateQueries(['profile', variables.id]);
      queryClient.invalidateQueries(['profile', 'me']);
      queryClient.invalidateQueries(['userFollowType']);
    },
  });

  return { followAction, isFollowError, isFollowLoading };
};
export default useFollowUser;
