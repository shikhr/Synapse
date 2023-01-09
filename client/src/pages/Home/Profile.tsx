import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Banner from '../../components/Avatar/Banner';
import Button from '../../components/UI/Button';
import DynamicNavTitle from '../../components/UI/DynamicNavTitle';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';
import {
  IoCalendarOutline,
  IoLinkOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import ProfileLoadingSkeleton from '../../components/Skeletons/ProfileLoadingSkeleton';
import useFollowUser from '../../hooks/useFollowUser';
import DisplayError from '../../components/Errrors/DisplayError';

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { userId } = useParams();
  const { user, getProfile } = useAppContext();

  const {
    isLoading: isProfileLoading,
    isError: isProfileError,
    data: profile,
    error: profileError,
    refetch,
  } = useQuery(['profile', userId], getProfile);

  const { followAction, isFollowError, isFollowLoading } = useFollowUser();

  if (isProfileLoading) {
    return (
      <div>
        <DynamicNavTitle title="Profile" />
        <ProfileLoadingSkeleton />;
      </div>
    );
  }

  if (isProfileError) {
    return (
      <div>
        <DynamicNavTitle title="Profile" />
        <div className="py-4">
          <DisplayError refetch={refetch} error={profileError} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DynamicNavTitle title="Profile" />
      <div className="relative w-full h-40">
        <Banner sourceId={profile.avatarId}>
          <div className="absolute bottom-0 translate-y-1/2 left-10">
            <div className="w-28 text-7xl xs:w-32 aspect-square bg-primary-0 rounded-full">
              <Avatar sourceId={profile.avatarId} />
            </div>
          </div>
        </Banner>
      </div>
      <div className="flex justify-end mt-4 px-4">
        <div className="w-28">
          {user?._id === profile._id && (
            <Button
              onClick={() => {
                navigate('/settings/profile', { state: location });
              }}
              variant="standard"
            >
              edit
            </Button>
          )}
          {user?._id !== profile._id && (
            <Button
              onClick={() => {
                followAction(
                  {
                    id: profile._id,
                    action: !profile.isFollowing ? 'follow' : 'unfollow',
                  },
                  {
                    onSettled(data, error, variables, context) {
                      queryClient.invalidateQueries(['profile', userId]);
                    },
                  }
                );
              }}
              variant="standard"
              disabled={isFollowLoading}
            >
              {!profile.isFollowing ? 'Follow' : 'Unfollow'}
            </Button>
          )}
        </div>
      </div>
      <div className="px-5 pt-6">
        <div className="text-text-primary-dark text-2xl font-bold">
          {profile.displayName}
        </div>
        <div className="text-text-secondary-dark text-md ">
          @{profile.username}
        </div>
        {profile.bio && (
          <div className="text-text-primary-dark text-md py-2">
            {profile.bio}
          </div>
        )}
        <div className="text-text-secondary-dark flex flex-wrap gap-x-6 gap-y-1 text-md">
          {profile.location && (
            <div className="flex items-center gap-1">
              <span>
                <IoLocationOutline />
              </span>
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1">
              <span className="pt-1">
                <IoLinkOutline />
              </span>
              <span>
                <a target="_blank" href={`//${profile.website}`}>
                  {profile?.website}
                </a>
              </span>
            </div>
          )}
          {profile.birthDate && (
            <div className="flex items-center gap-1">
              <span>
                <IoCalendarOutline />
              </span>
              <span>
                {format(new Date(profile.birthDate as string), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-6 text-text-primary-dark text-md py-2 font-bold">
          <div onClick={() => {}} className="cursor-pointer hover:underline">
            {profile.following}
            <span className="text-text-secondary-dark font-normal">
              {' '}
              Following
            </span>
          </div>
          <div onClick={() => {}} className="cursor-pointer hover:underline">
            {profile.followers}
            <span className="text-text-secondary-dark font-normal">
              {' '}
              Followers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
