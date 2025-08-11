import DynamicNavTitle from '../../components/UI/DynamicNavTitle';
import NotificationList from '../../components/Notifications/NotificationList';

const Notifications = () => {
  return (
    <div>
      <DynamicNavTitle title="Notifications" />
      <NotificationList />
    </div>
  );
};
export default Notifications;
