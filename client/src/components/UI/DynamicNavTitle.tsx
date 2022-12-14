import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DynamicNavTitle = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="flex text-text-primary-dark items-center py-2 px-4 w-full sticky z-10 top-0 justify-between bg-opacity-50 bg-background-dark backdrop-blur-md ">
      <div
        onClick={() => {
          navigate(-1);
        }}
        className="text-xl font-light cursor-pointer flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors"
      >
        <FaArrowLeft />
      </div>
      <h2 className="mx-auto text-2xl font-semibold capitalize">{title}</h2>
    </div>
  );
};

export default DynamicNavTitle;
