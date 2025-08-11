import { formatDistanceToNowStrict } from 'date-fns';
import Avatar from '../Avatar/Avatar';

interface NotificationListItemProps {
  _id: string;
  type: string;
  from?: string;
  entity?: { kind: string; id?: string };
  payload?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

const typeToText = (n: NotificationListItemProps) => {
  switch (n.type) {
    case 'user.follow':
      return 'started following you';
    case 'user.unfollow':
      return 'stopped following you';
    case 'post.like':
      return 'liked your post';
    case 'post.comment':
      return 'commented on your post';
    default:
      return n.type;
  }
};

const NotificationListItem = (n: NotificationListItemProps) => {
  return (
    <div
      className={`flex gap-3 px-4 py-3 border-b border-text-secondary-dark ${
        n.read ? 'opacity-70' : ''
      }`}
    >
      <div className="w-12 shrink-0">
        <Avatar sourceId={n.payload?.fromAvatarId} />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-sm">
          <span className="font-semibold">
            {n.payload?.fromDisplayName || 'Someone'}
          </span>{' '}
          <span className="text-text-secondary-dark">{typeToText(n)}</span>
        </div>
        {n.payload?.preview && (
          <div className="text-text-secondary-dark text-sm line-clamp-2">
            {n.payload.preview}
          </div>
        )}
        <div className="text-xs text-text-secondary-dark">
          {formatDistanceToNowStrict(new Date(n.createdAt))} ago
        </div>
      </div>
    </div>
  );
};

export default NotificationListItem;
