import { QueryFunctionContext } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import CommentCard from '../Comment/CommentCard';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import CommentLoadingSkeleton from '../Skeletons/CommentLoadingSkeleton';

interface searchPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const SearchComments = () => {
  const { authFetch } = useAppContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const fetchComments = async ({ pageParam }: QueryFunctionContext) => {
    const { data } = await authFetch.get('/search', {
      params: { page: pageParam, type: 'comments', q: query },
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
    queryKey: ['search', 'comments', query],
    queryFn: fetchComments,
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
      LoadingSkeleton={<CommentLoadingSkeleton />}
      FeedErrorComponent={<FeedLoadingError refetch={fetchNextPage} />}
      ListItemComponent={CommentCard}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={<div>No comments found.</div>}
      ref={observerElem}
    />
  );
};

export default SearchComments;
