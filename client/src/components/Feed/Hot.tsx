import { useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import { useRef, useCallback, useEffect } from 'react';
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
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  const observerElem = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current as Element;
    const option = { threshold: 0, rootMargin: '500px' };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

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
      {isError && !isFetchingNextPage && (
        <FeedLoadingError refetch={fetchNextPage} />
      )}
      <div className="loader" ref={observerElem}>
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
