import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../context/AppContext';

const useFetchProfile = (id: string) => {
  const { getProfile } = useAppContext();

  const data = useQuery(['profile', id], getProfile, {
    refetchOnWindowFocus: false,
    staleTime: 300000,
    retry: false,
  });

  return data;
};
export default useFetchProfile;
