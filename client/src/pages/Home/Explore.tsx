import { useMemo } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import FeedLoadingError from '../../components/Errrors/FeedLoadingError';
import InfiniteScrollList from '../../components/InfiniteScrollList/InfiniteScrollList';
import FadeInView from '../../components/MotionWrapper/FadeInView';
import PostCard from '../../components/Post/PostCard';
import PostLoadingSkeleton from '../../components/Skeletons/PostLoadingSkeleton';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';

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

  const fetchFeed = async ({ pageParam = 1 }) => {
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
    <div className="text-white">
      <div className="sticky top-0 z-sticky px-4 py-2 bg-opacity-50 bg-background-dark backdrop-blur-md ">
        <div className="w-full group flex rounded-full px-6 py-1 justify-start items-center bg-background-overlay-dark ">
          <RiSearchLine
            className="text-text-secondary-dark group-focus-within:text-primary-100"
            size={20}
          />
          <input
            className="bg-transparent outline-none border-none py-2 px-4"
            type="text"
            placeholder="I am looking for..."
          />
        </div>
      </div>
      <FadeInView>
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
      </FadeInView>
    </div>
  );
};
export default Explore;
