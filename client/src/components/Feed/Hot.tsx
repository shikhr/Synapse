import { useAppContext } from '../../context/AppContext';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';

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
      params: { page: pageParam, filterBy: 'popular' },
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
      staleTime: 300000,
    },
    getNextPageParam: (lastPage, pages) => {
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
      ListItemComponent={PostCard}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={
        <>
          <div>
            <h4 className="text-lg">Nothing to see</h4>
            <p>Follow more people to get recommendations</p>
          </div>
          <div className="w-40">
            <Link to="/explore">
              <Button variant="standard">Explore</Button>
            </Link>
          </div>
        </>
      }
      ref={observerElem}
    />
  );
};
export default Hot;
