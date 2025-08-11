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
    isPending: isFollowLoading,
    isError: isFollowError,
  } = useMutation({
    mutationFn: followHandler,
    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['userFollowType'] });
    },
  });

  return { followAction, isFollowError, isFollowLoading };
};
export default useFollowUser;
