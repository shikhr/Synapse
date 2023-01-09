import { DisplayErrorProps } from '../../types/Error.types';
import DisplayError from './DisplayError';

const FeedLoadingError = ({ refetch, error }: DisplayErrorProps) => {
  return (
    <div className="w-full py-10 justify-center items-center">
      <DisplayError refetch={refetch} error={error} />
    </div>
  );
};
export default FeedLoadingError;
