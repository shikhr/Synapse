import { QueryFunctionContext } from '@tanstack/react-query';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import NotificationListItem from './NotificationListItem';

interface notificationsPage {
  data: any[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const NotificationList = () => {
  const { authFetch } = useAppContext();

  const fetchNotifications = async ({ pageParam }: QueryFunctionContext) => {
    const { data } = await authFetch.get('/notifications', {
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
    isFetchingNextPage,
    refetch,
    observerElem,
  } = useInfiniteQueryScroll<notificationsPage>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  return (
    <InfiniteScrollList
      data={data}
      isLoading={isLoading}
      isError={isError}
      LoadingSkeleton={<PostLoadingSkeleton />}
      FeedErrorComponent={<FeedLoadingError refetch={fetchNextPage} />}
      ListItemComponent={NotificationListItem}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={<div>No notifications yet.</div>}
      ref={observerElem}
    />
  );
};

export default NotificationList;
