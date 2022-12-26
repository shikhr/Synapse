import { useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import Button from '../UI/Button';

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
  } = useInfiniteQuery(['feed', 'hot'], fetchFeed, {
    retry: 2,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  if (isLoadingError) {
    return <FeedLoadingError refetch={refetch} />;
  }

  console.log(data);
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
          data.pages.map((page) => {
            return page.mydata.map((id: string) => (
              <PostCard key={id} id={id} />
            ));
          })}
      </div>
      <Button
        variant="standard"
        disabled={!hasNextPage}
        onClick={() => fetchNextPage()}
      >
        next
      </Button>
      {isFetchingNextPage && (
        <>
          <PostLoadingSkeleton />
        </>
      )}
      {isError && !isFetchingNextPage && (
        <FeedLoadingError refetch={fetchNextPage} />
      )}
    </div>
  );
};
export default Hot;
