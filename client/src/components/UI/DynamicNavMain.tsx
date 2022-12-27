import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Avatar from '../Avatar/Avatar';

const DynamicNavMain = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  return (
    <div className="flex text-text-primary-dark items-center py-2 px-4 w-full sticky z-sticky top-0 justify-between bg-opacity-50 bg-background-dark backdrop-blur-md ">
      <div
        onClick={() => {}}
        className="cursor-pointer xs:hidden text-2xl flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors"
      >
        <Avatar sourceId={user?.avatarId} />
      </div>
      <h2 className="mx-auto text-2xl font-semibold capitalize">{title}</h2>
    </div>
  );
};

export default DynamicNavMain;
