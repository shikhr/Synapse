import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

interface useInfiniteQueryScrollParams<T> {
  queryKey: string[];
  queryFn: QueryFunction<T, QueryKey>;
  options?:
    | Omit<
        UseInfiniteQueryOptions<unknown, unknown, unknown, unknown, string[]>,
        'queryKey' | 'queryFn'
      >
    | undefined;
  getNextPageParam: (lastPage: T, allPages: T[]) => unknown | undefined;
}

const useInfiniteQueryScroll = <T>(
  useInfiniteQueryParams: useInfiniteQueryScrollParams<T>
) => {
  const {
    isLoading,
    isError,
    isLoadingError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(useInfiniteQueryParams);

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
    const option = { threshold: 0, rootMargin: '200px' };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return {
    isLoading,
    isError,
    isLoadingError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    observerElem,
  };
};
export default useInfiniteQueryScroll;
