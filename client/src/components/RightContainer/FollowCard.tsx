import { Link, useNavigate } from 'react-router-dom';
import useFollowUser from '../../hooks/useFollowUser';
import { IUserBasic } from '../../types/Register.types';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button';

interface FollowCardProps extends IUserBasic {
  className?: string;
}

const FollowCard = ({
  _id,
  username,
  displayName,
  avatarId,
  followExists,
  className,
}: FollowCardProps) => {
  const navigate = useNavigate();

  const { followAction, isFollowError, isFollowLoading } = useFollowUser();

  return (
    <div
      onClick={() => navigate(`/profile/${_id}`)}
      className={`flex w-full hover:bg-background-overlay-dark gap-4 text-text-primary-dark cursor-pointer items-center ${
        className ?? ''
      }`}
    >
      <div className="w-14 aspect-square shrink-0 text-3xl">
        <Avatar sourceId={avatarId} />
      </div>
      <div className="flex flex-col overflow-hidden whitespace-nowrap">
        <span className="font-semibold text-md overflow-hidden text-ellipsis ">
          {displayName}
        </span>
        <span className="text-text-secondary-dark text-sm overflow-hidden text-ellipsis">
          @{username}
        </span>
      </div>
      <div className="min-w-22 ml-auto shrink-0">
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (isFollowLoading) return;
            followAction({
              id: _id,
              action: followExists ? 'unfollow' : 'follow',
            });
          }}
          variant="standard"
        >
          {followExists ? 'Unfollow' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};
export default FollowCard;
