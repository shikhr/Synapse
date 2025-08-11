import { QueryFunctionContext } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import { IUserBasic } from '../../types/Register.types';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import FollowCard from '../RightContainer/FollowCard';
import UserLoadingSkeleton from '../Skeletons/UserLoadingSkeleton';

interface searchPage {
  data: IUserBasic[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const SearchUsers = () => {
  const { authFetch } = useAppContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const fetchUsers = async ({ pageParam }: QueryFunctionContext) => {
    const { data } = await authFetch.get('/search', {
      params: { page: pageParam, type: 'users', q: query },
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
    isFetchingNextPage,
    refetch,
    observerElem,
  } = useInfiniteQueryScroll<searchPage>({
    queryKey: ['search', 'users', query],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
    enabled: !!query,
  });

  return (
    <InfiniteScrollList
      data={data}
      isLoading={isLoading}
      isError={isError}
      LoadingSkeleton={<UserLoadingSkeleton />}
      FeedErrorComponent={<FeedLoadingError refetch={fetchNextPage} />}
      ListItemComponent={FollowCard}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={<div>No users found.</div>}
      ref={observerElem}
      ListItemProps={{ className: 'px-4 sm:px-12 py-4' }}
    />
  );
};

export default SearchUsers;
