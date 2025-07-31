import { QueryFunctionContext } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import { IUserBasic } from '../../types/Register.types';
import ErrorWithRefetch from '../Errrors/ErrorWithRefetch';
import FadeInView from '../MotionWrapper/FadeInView';
import FollowCard from '../RightContainer/FollowCard';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import Overlay from '../UI/Overlay';

interface UserFollowList {
  type: 'followers' | 'following';
}

interface followTypePage {
  data: IUserBasic[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const UserFollowList = ({ type }: UserFollowList) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { authFetch } = useAppContext();

  const fetchUserFollowType = async ({
    queryKey,
    pageParam,
  }: QueryFunctionContext) => {
    const type = queryKey[1];
    const userId = queryKey[2];
    const { data } = await authFetch.get(`/users/${type}/${userId}`, {
      params: { page: pageParam },
    });
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isLoadingError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    observerElem,
  } = useInfiniteQueryScroll<followTypePage>({
    queryKey: ['userFollowType', type, userId as string],
    queryFn: fetchUserFollowType,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  if (isLoadingError) {
    return (
      <div className="h-full">
        <ErrorWithRefetch refetch={refetch} />
      </div>
    );
  }

  const content = useMemo(
    () =>
      data?.pages.flatMap((page: followTypePage) =>
        page.data.map((user: IUserBasic) => (
          <FollowCard key={user._id} {...user} />
        ))
      ),
    [data]
  );

  return (
    <div>
      <Overlay closeModal={() => navigate(-1)} />
      <Modal>
        <>
          <FadeInView className="md:rounded-lg md:overflow-auto h-full">
            <DynamicNavTitle title={type} />
            <div className="overflow-auto h-[calc(100%-3.5rem)] bg-background-dark">
              {isLoading && <LoadingSpinner />}
              <div className="flex flex-col">
                {data && data.pages && content}
              </div>
              {content?.length === 0 && !hasNextPage && (
                <div className="px-4 py-8 flex flex-col justify-center items-center text-center gap-6 text-text-secondary-dark">
                  {type === 'followers' && 'No followers yet!'}
                  {type === 'following' && 'Following no one yet!'}
                </div>
              )}
              {isError && !isFetchingNextPage && 'FeedErrorComponent'}
              <div ref={observerElem}>
                {isFetchingNextPage && hasNextPage && 'LoadingSkeleton'}
              </div>
            </div>
          </FadeInView>
        </>
      </Modal>
    </div>
  );
};
export default UserFollowList;
