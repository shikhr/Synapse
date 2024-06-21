import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useOuterClick from '../../hooks/useOuterClick';
import Avatar from '../Avatar/Avatar';
import MobileBar from '../Navigation/MobileBar';
import CustomModal from './CustomModal';
import Modal from './Modal';
import Overlay from './Overlay';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicNavMain = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const { innerRef, isComponentVisible, setIsComponentVisible } =
    useOuterClick<HTMLDivElement>();

  return (
    <div className="flex text-center text-text-primary-dark items-center h-14 px-4 w-full sticky z-sticky top-0 justify-between bg-opacity-50 bg-background-dark backdrop-blur-md ">
      <div
        onClick={() => setIsComponentVisible(true)}
        className="cursor-pointer xs:hidden text-2xl flex justify-center items-center w-7 aspect-square rounded-full hover:bg-gray-800 transition-colors"
      >
        <Avatar sourceId={user?.avatarId} />
      </div>
      <h2 className="mx-auto text-2xl whitespace-nowrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold capitalize">
        {title}
      </h2>
      <AnimatePresence>
        {isComponentVisible && (
          <div>
            <Overlay
              className="block xs:hidden"
              closeModal={() => setIsComponentVisible(false)}
            />
            <CustomModal>
              <motion.div
                animate={{ x: 0 }}
                initial={{ x: -320 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.3, type: 'tween' }}
                ref={innerRef}
                className="fixed top-0 left-0 z-modal w-full max-w-xs h-full"
              >
                <MobileBar
                  closeMobileBar={() => setIsComponentVisible(false)}
                />
              </motion.div>
            </CustomModal>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicNavMain;
