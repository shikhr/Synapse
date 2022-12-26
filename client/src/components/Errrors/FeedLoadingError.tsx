import { ErrorWithRefetchProps } from '../../types/Error.types';
import ErrorWithRefetch from './ErrorWithRefetch';

const FeedLoadingError = ({ refetch }: ErrorWithRefetchProps) => {
  return (
    <div className="w-full py-10 justify-center items-center">
      <ErrorWithRefetch refetch={refetch} />
    </div>
  );
};
export default FeedLoadingError;
