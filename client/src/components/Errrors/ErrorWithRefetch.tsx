import { ErrorWithRefetchProps } from '../../types/Error.types';
import Button from '../UI/Button';

const ErrorWithRefetch = ({ refetch }: ErrorWithRefetchProps) => {
  return (
    <div className="w-full flex flex-col gap-6 justify-center items-center">
      <span className="text-text-secondary-dark">
        Something went wrong! Try reloading
      </span>
      <div className="w-40">
        <Button onClick={refetch} variant="primary">
          Reload
        </Button>
      </div>
    </div>
  );
};
export default ErrorWithRefetch;
