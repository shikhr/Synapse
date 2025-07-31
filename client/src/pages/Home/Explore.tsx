import { FormEvent, useState, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import FeedLoadingError from '../../components/Errrors/FeedLoadingError';
import InfiniteScrollList from '../../components/InfiniteScrollList/InfiniteScrollList';
import FadeInView from '../../components/MotionWrapper/FadeInView';
import PostCard from '../../components/Post/PostCard';
import PostLoadingSkeleton from '../../components/Skeletons/PostLoadingSkeleton';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import { QueryFunctionContext } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import SearchResults from '../../components/Search/SearchResults';

interface feedPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const Explore = () => {
  const { authFetch } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (debouncedQuery.trim()) {
      newSearchParams.set('q', debouncedQuery);
    } else {
      newSearchParams.delete('q');
    }
    if (newSearchParams.get('q') !== searchParams.get('q')) {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [debouncedQuery, searchParams, setSearchParams]);

  const fetchFeed = async ({ pageParam }: QueryFunctionContext) => {
    const { data } = await authFetch.get('/posts/explore', {
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
    queryKey: ['explore-all'],
    queryFn: fetchFeed,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  return (
    <div className="text-white">
      <div className="sticky top-0 z-sticky px-4 py-2 bg-background-dark/50 backdrop-blur-md ">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="w-full group flex rounded-full px-6 py-1 justify-start items-center bg-background-overlay-dark ">
            <RiSearchLine
              className="text-text-secondary-dark group-focus-within:text-primary-100"
              size={20}
            />
            <input
              className="bg-transparent outline-none border-none py-2 px-4 w-full"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <FadeInView>
        {debouncedQuery.trim() ? (
          <SearchResults />
        ) : (
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
            ref={observerElem}
          />
        )}
      </FadeInView>
    </div>
  );
};
export default Explore;
