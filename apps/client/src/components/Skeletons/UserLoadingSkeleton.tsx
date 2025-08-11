import Skeleton from 'react-loading-skeleton';

const UserLoadingSkeleton = () => {
  return (
    <div className="w-full flex items-center leading-none gap-3 px-3 py-4 border-b border-text-secondary-dark">
      <div className="basis-14 h-14 shrink-0 aspect-square">
        <Skeleton circle width="100%" height="100%" />
      </div>
      <div className="basis-full flex flex-col gap-2">
        <div className="w-40 leading-tight">
          <Skeleton
            count={2}
            width="100%"
            borderRadius="1rem"
            height="0.75rem"
          />
        </div>
      </div>
      <div className="w-24 h-10 ml-auto">
        <Skeleton width="100%" height="100%" borderRadius="2rem" />
      </div>
    </div>
  );
};

export default UserLoadingSkeleton;
