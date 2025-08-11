import { Outlet } from 'react-router-dom';
import FadeInView from '../components/MotionWrapper/FadeInView';

const Settings = () => {
  return (
    <FadeInView>
      <Outlet />
    </FadeInView>
  );
};
export default Settings;
