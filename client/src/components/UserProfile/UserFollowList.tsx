import { useNavigate, useParams } from 'react-router-dom';
import FadeInView from '../MotionWrapper/FadeInView';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import Modal from '../UI/Modal';
import Overlay from '../UI/Overlay';

interface UserFollowList {
  type: 'followers' | 'following';
}

const UserFollowList = ({ type }: UserFollowList) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  return (
    <div>
      <Overlay closeModal={() => navigate(-1)} />
      <Modal>
        <>
          <DynamicNavTitle title={type} />
          <FadeInView>
            <div className="max-h-full">{type}</div>
            <div className="max-h-full">{userId}</div>
          </FadeInView>
        </>
      </Modal>
    </div>
  );
};
export default UserFollowList;
