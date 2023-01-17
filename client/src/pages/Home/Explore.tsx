import { useMemo } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import FeedLoadingError from '../../components/Errrors/FeedLoadingError';
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
      {isLoading && (
        <>
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
          <PostLoadingSkeleton />
        </>
      )}
      <div className="flex flex-col">{data && data.pages && content}</div>
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
export default Explore;
