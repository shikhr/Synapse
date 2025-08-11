import Skeleton from 'react-loading-skeleton';

const ProfileLoadingSkeleton = () => {
  return (
    <div className="w-full">
      <div className="relative w-full h-40">
        <div className="absolute z-40 w-32 border-2 border-opacity-50 rounded-full border-text-secondary-dark leading-none h-32 bottom-0 translate-y-1/2 left-10">
          <Skeleton width="100%" circle height="100%" />
        </div>
        <Skeleton width="100%" height="100%" />
      </div>
      <div className="w-full">
        <div className="ml-auto w-40 mt-4 px-4 h-10">
          <Skeleton width="100%" borderRadius="1.25rem" height="100%" />
        </div>
        <div className="w-48 pt-6 px-5 flex flex-col gap-1">
          <Skeleton width="100%" borderRadius="1rem" height="1.25rem" />
          <Skeleton width="80%" borderRadius="1rem" height="1rem" />
        </div>
        <div className="w-80 pt-4 px-5 flex flex-col gap-0.75">
          <Skeleton width="100%" borderRadius="1rem" height="1rem" />
          <Skeleton width="40%" borderRadius="1rem" height="1rem" />
        </div>
      </div>
    </div>
  );
};
export default ProfileLoadingSkeleton;
