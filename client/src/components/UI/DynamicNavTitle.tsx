import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DynamicNavTitle = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="flex text-center text-text-primary-dark items-center h-14 px-4 w-full sticky z-sticky top-0 justify-between bg-opacity-50 bg-background-dark backdrop-blur-md ">
      <div
        onClick={() => {
          navigate(-1);
        }}
        className="text-xl font-light cursor-pointer flex justify-center items-center w-10 aspect-square rounded-full hover:bg-gray-800 transition-colors"
      >
        <FaArrowLeft />
      </div>
      <h2 className="mx-auto text-2xl whitespace-nowrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold capitalize">
        {title}
      </h2>
    </div>
  );
};

export default DynamicNavTitle;
