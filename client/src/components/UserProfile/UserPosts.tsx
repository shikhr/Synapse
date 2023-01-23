import { QueryFunctionContext } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import PostCard from '../Post/PostCard';
import PostLoadingSkeleton from '../Skeletons/PostLoadingSkeleton';

interface feedPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

interface UserPostsProps {
  id: string;
}

const UserPosts = () => {
  const { authFetch, user } = useAppContext();
  const { userId } = useParams();

  const getUserPosts = async ({
    queryKey,
    pageParam = 1,
  }: QueryFunctionContext) => {
    const { data } = await authFetch.get(`/posts/user/${queryKey[1]}`, {
      params: { page: pageParam, filterBy: 'new' },
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
    queryKey: ['posts', userId as string],
    queryFn: getUserPosts,
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

  if (isLoadingError) {
    return <FeedLoadingError refetch={refetch} />;
  }

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
      NoContentElement={<div>You haven't posted anything yet!</div>}
      ref={observerElem}
    />
  );
};
export default UserPosts;
