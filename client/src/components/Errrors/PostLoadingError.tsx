import { ErrorWithRefetchProps } from '../../types/Error.types';
import ErrorWithRefetch from './ErrorWithRefetch';

const PostLoadingError = ({ refetch }: ErrorWithRefetchProps) => {
  return (
    <div className="w-full flex h-52 justify-center items-center border-b border-text-secondary-dark">
      <ErrorWithRefetch refetch={refetch} />
    </div>
  );
};
export default PostLoadingError;
