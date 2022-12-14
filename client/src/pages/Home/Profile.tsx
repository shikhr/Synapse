import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Banner from '../../components/Avatar/Banner';
import Button from '../../components/UI/Button';
import DynamicNavTitle from '../../components/UI/DynamicNavTitle';
import { useAppContext } from '../../context/AppContext';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { user, getProfile } = useAppContext();

  const { isLoading, data: profile } = useQuery(
    ['profile', userId],
    getProfile
  );
  if (isLoading) {
    return <div>loading</div>;
  }
  return (
    <div>
      <DynamicNavTitle title="Profile" />
      <div className="relative w-full h-40">
        <Banner sourceId={profile?.avatarId}>
          <div className="absolute bottom-0 translate-y-1/2 left-10">
            <div className="w-28 xs:w-32 aspect-square bg-primary-0 rounded-full">
              <Avatar sourceId={profile?.avatarId} />
            </div>
          </div>
        </Banner>
      </div>
      <div className="flex justify-end mt-4 px-4">
        <div className="w-28">
          {user?._id === profile?._id && (
            <Button
              onClick={() => {
                navigate('/settings/profile', { state: location });
              }}
              variant="standard"
            >
              edit
            </Button>
          )}
          {user?._id !== profile?._id && !profile?.isFollowing && (
            <Button onClick={() => {}} variant="standard">
              Follow
            </Button>
          )}
          {user?._id !== profile?._id && profile?.isFollowing && (
            <Button onClick={() => {}} variant="standard">
              Unfollow
            </Button>
          )}
        </div>
      </div>
      <div className="px-5 pt-6">
        <div className="text-text-primary-dark text-2xl font-bold">
          {profile?.displayName}
        </div>
        <div className="text-text-secondary-dark text-md ">
          @{profile?.username}
        </div>
        {profile?.bio && (
          <div className="text-text-primary-dark text-md py-2">
            {profile?.bio}
          </div>
        )}
        <div className="text-text-primary-dark text-md">
          <div>{profile?.location}</div>
          <div>{profile?.website}</div>
        </div>
        <div className="flex gap-6 text-text-primary-dark text-md py-2 font-bold">
          <div onClick={() => {}} className="cursor-pointer hover:underline">
            {profile?.following}
            <span className="text-text-secondary-dark font-normal">
              {' '}
              Following
            </span>
          </div>
          <div onClick={() => {}} className="cursor-pointer hover:underline">
            {profile?.followers}
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
