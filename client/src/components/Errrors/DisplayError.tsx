import axios from 'axios';
import { DisplayErrorProps } from '../../types/Error.types';
import ErrorWithRefetch from './ErrorWithRefetch';

const DisplayError = ({ refetch, error }: DisplayErrorProps) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center text-text-secondary-dark">
          <h2 className="text-9xl drop-shadow-lg shadow-white">404</h2>
          <h1 className="text-xl">Not Found</h1>
        </div>
      );
    }
  }
  return <ErrorWithRefetch refetch={refetch} />;
};
export default DisplayError;
