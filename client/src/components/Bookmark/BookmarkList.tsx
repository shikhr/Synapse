import { QueryFunctionContext } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';

interface bookmarksListPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const BookmarkList = () => {
  const { authFetch } = useAppContext();

  const fetchBookmarkList = async ({ pageParam }: QueryFunctionContext) => {
    const { data } = await authFetch.get('/bookmarks', {
      params: { page: pageParam },
    });
    return data;
  };

  const {
    data: bookmarkList,
    isLoading,
    isError,
    isLoadingError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    observerElem,
  } = useInfiniteQueryScroll<bookmarksListPage>({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarkList,
    options: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  return (
    <InfiniteScrollList
      data={bookmarkList}
      isLoading={isLoading}
      isError={isError}
      LoadingSkeleton={<PostLoadingSkeleton />}
      FeedErrorComponent={<FeedLoadingError refetch={fetchNextPage} />}
      ListItemComponent={PostCard}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={
        <div>There are no bookmarks yet! Save some posts to see them here.</div>
      }
      ref={observerElem}
    />
  );
};
export default BookmarkList;
