import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';
import { IUserProfile } from '../types/Register.types';

const useFetchProfile = (id: string) => {
  const { authFetch } = useAppContext();

  const getProfile = async ({
    queryKey,
  }: QueryFunctionContext): Promise<IUserProfile> => {
    const { data } = await authFetch.get(`/users/profile/${queryKey[1]}`);
    return data;
  };

  const data = useQuery({
    queryKey: ['profile', id],
    queryFn: getProfile,
    refetchOnWindowFocus: false,
    staleTime: 300000,
    retry: false
  });

  return data;
};
export default useFetchProfile;
