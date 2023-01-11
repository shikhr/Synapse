import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useOuterClick from '../../hooks/useOuterClick';
import Avatar from '../Avatar/Avatar';
import MobileBar from '../Navigation/MobileBar';
import CustomModal from './CustomModal';
import Modal from './Modal';
import Overlay from './Overlay';

const DynamicNavMain = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const { innerRef, isComponentVisible, setIsComponentVisible } =
    useOuterClick<HTMLDivElement>();

  return (
    <div className="flex text-text-primary-dark items-center py-2 px-4 w-full sticky z-sticky top-0 justify-between bg-opacity-50 bg-background-dark backdrop-blur-md ">
      <div
        onClick={() => setIsComponentVisible(true)}
        className="cursor-pointer xs:hidden text-2xl flex justify-center items-center w-8 aspect-square rounded-full hover:bg-gray-800 transition-colors"
      >
        <Avatar sourceId={user?.avatarId} />
      </div>
      <h2 className="mx-auto text-2xl font-semibold capitalize">{title}</h2>
      {isComponentVisible && (
        <div>
          <Overlay
            className="block xs:hidden"
            closeModal={() => setIsComponentVisible(false)}
          />
          <CustomModal>
            <div ref={innerRef} className="block xs:hidden">
              <MobileBar closeMobileBar={() => setIsComponentVisible(false)} />
            </div>
          </CustomModal>
        </div>
      )}
    </div>
  );
};

export default DynamicNavMain;
