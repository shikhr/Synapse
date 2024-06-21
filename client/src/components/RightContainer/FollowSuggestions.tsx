import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import { IUserBasic, IUserProfile } from '../../types/Register.types';
import LoadingSpinner from '../UI/LoadingSpinner';
import FollowCard from './FollowCard';

const FollowSuggestions = () => {
  const { authFetch } = useAppContext();

  const getFollowSuggestion = async () => {
    const { data } = await authFetch.get('/users/followsuggest');
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['follow-suggestions'],
    queryFn: getFollowSuggestion
  });
  return (
    <div className="">
      {isLoading && <LoadingSpinner />}
      {data && data.length > 0 && (
        <div className="bg-background-overlay-dark p-4 rounded-lg flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-primary-dark">
            Who To Follow
          </h2>
          {data.map((user: IUserBasic) => (
            <FollowCard key={user._id} {...user} />
          ))}
        </div>
      )}
    </div>
  );
};
export default FollowSuggestions;
