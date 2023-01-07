import { QueryFunctionContext } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import FeedLoadingError from '../Errrors/FeedLoadingError';
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

  if (isLoadingError) {
    return <FeedLoadingError refetch={refetch} />;
  }
  console.log(bookmarkList);
  return (
    <div>
      {isLoading && (
        <>
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
        </>
      )}
      <div className="flex flex-col">
        {bookmarkList &&
          bookmarkList.pages &&
          bookmarkList.pages.map((page: bookmarksListPage) => {
            return page.data.map((id: string) => <PostCard key={id} id={id} />);
          })}
      </div>
      {isError && !isFetchingNextPage && (
        <FeedLoadingError refetch={fetchNextPage} />
      )}
      <div ref={observerElem}>
        {isFetchingNextPage && hasNextPage && <PostLoadingSkeleton />}
      </div>
      <div>
        {!isFetchingNextPage && !hasNextPage && (
          <div className="w-full text-center px-2 py-8 text-text-secondary-dark">
            You have reached the end
          </div>
        )}
      </div>
    </div>
  );
};
export default BookmarkList;
