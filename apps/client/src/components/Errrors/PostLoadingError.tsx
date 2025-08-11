import { DisplayErrorProps } from '../../types/Error.types';
import DisplayError from './DisplayError';

const PostLoadingError = ({ refetch, error }: DisplayErrorProps) => {
  return (
    <div className="w-full flex h-52 justify-center items-center border-b border-text-secondary-dark">
      <DisplayError refetch={refetch} error={error} />
    </div>
  );
};
export default PostLoadingError;
