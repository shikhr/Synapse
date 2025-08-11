import Skeleton from 'react-loading-skeleton';

const PostLoadingSkeleton = () => {
  return (
    <div className="w-full flex leading-none gap-3 px-3 py-4 border-b h-52 border-text-secondary-dark">
      <div className="basis-14 h-14 shrink-0 aspect-square">
        <Skeleton circle width="100%" borderRadius="0" height="100%" />
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
        <div className="leading-tight">
          <Skeleton
            count={5}
            width="100%"
            borderRadius="1rem"
            height="0.75rem"
          />
          <Skeleton width="60%" borderRadius="1rem" height="0.75rem" />
        </div>
      </div>
    </div>
  );
};
export default PostLoadingSkeleton;
