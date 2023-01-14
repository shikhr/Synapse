import { useAppContext } from '../../context/AppContext';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

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

  const content = useMemo(
    () =>
      data?.pages.flatMap((page: feedPage) =>
        page.data.map((id: string) => <PostCard key={id} id={id} />)
      ),
    [data]
  );

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
      <div className="flex flex-col">{data && data.pages && content}</div>
      {content?.length === 0 && !hasNextPage && (
        <div className="px-4 py-8 flex flex-col justify-center items-center text-center gap-6 text-text-secondary-dark">
          <div>
            <h4 className="text-lg">Nothing to see</h4>
            <p>Follow more people to get recommendations</p>
          </div>
          <div className="w-40">
            <Link to="/explore">
              <Button variant="standard">Explore</Button>
            </Link>
          </div>
        </div>
      )}
      {isError && !isFetchingNextPage && (
        <FeedLoadingError refetch={fetchNextPage} />
      )}
      <div ref={observerElem}>
        {isFetchingNextPage && hasNextPage && <PostLoadingSkeleton />}
      </div>
      <div>
        {content?.length !== 0 && !isFetchingNextPage && !hasNextPage && (
          <div className="w-full text-center px-2 py-8 text-text-secondary-dark">
            You have reached the end
          </div>
        )}
      </div>
    </div>
  );
};
export default Hot;
