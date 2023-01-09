import axios from 'axios';
import { DisplayErrorProps } from '../../types/Error.types';
import ErrorWithRefetch from './ErrorWithRefetch';

const DisplayError = ({ refetch, error }: DisplayErrorProps) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return <div>Not Found</div>;
    }
  }
  return <ErrorWithRefetch refetch={refetch} />;
};
export default DisplayError;
