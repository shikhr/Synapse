import { QueryFunctionContext } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';

interface searchPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const SearchPosts = () => {
  const { authFetch } = useAppContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const fetchPosts = async ({ pageParam }: QueryFunctionContext) => {
    const { data } = await authFetch.get('/search', {
      params: { page: pageParam, type: 'posts', q: query },
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
    queryKey: ['search', 'posts', query],
    queryFn: fetchPosts,
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
      LoadingSkeleton={<PostLoadingSkeleton />}
      FeedErrorComponent={<FeedLoadingError refetch={fetchNextPage} />}
      ListItemComponent={PostCard}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={<div>No posts found.</div>}
      ref={observerElem}
    />
  );
};

export default SearchPosts;
