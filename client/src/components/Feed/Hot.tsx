import { useAppContext } from '../../context/AppContext';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';

interface feedPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const Hot = () => {
  const { authFetch } = useAppContext();

  const fetchFeed = async ({ pageParam = 1 }) => {
    const { data } = await authFetch.get('/posts/feed', {
      params: { page: pageParam },
    });
    return data;
  };

  const {
    isLoading,
    isError,
    isLoadingError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    observerElem,
  } = useInfiniteQueryScroll<feedPage>({
    queryKey: ['feed', 'hot'],
    queryFn: fetchFeed,
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

  console.log(data);

  if (isLoadingError) {
    return <FeedLoadingError refetch={refetch} />;
  }

  return (
    <div className="text-white">
      {isLoading && (
        <>
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
        </>
      )}
      <div className="flex flex-col">
        {data &&
          data.pages &&
          data.pages.map((page: feedPage) => {
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
export default Hot;
