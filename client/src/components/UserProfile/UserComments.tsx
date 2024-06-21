import { QueryFunctionContext } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import CommentCard from '../Comment/CommentCard';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import CommentLoadingSkeleton from '../Skeletons/CommentLoadingSkeleton';

interface commentsListPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const UserComments = () => {
  const { userId } = useParams();
  const { authFetch } = useAppContext();

  const fetchCommentList = async ({
    queryKey,
    pageParam,
  }: QueryFunctionContext) => {
    const userId = queryKey[1];
    const { data } = await authFetch.get(`/comments/user/${userId}`, {
      params: { page: pageParam, filterBy: 'new' },
    });
    return data;
  };

  const {
    data: commentList,
    isLoading,
    isError,
    isLoadingError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    observerElem,
  } = useInfiniteQueryScroll<commentsListPage>({
    queryKey: ['userCommentList', userId as string],
    queryFn: fetchCommentList,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  return (
    <InfiniteScrollList
      data={commentList}
      isLoading={isLoading}
      isError={isError}
      LoadingSkeleton={<CommentLoadingSkeleton />}
      FeedErrorComponent={<FeedLoadingError refetch={fetchNextPage} />}
      ListItemComponent={CommentCard}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={<div>You haven't commented on anything yet!</div>}
      ref={observerElem}
    />
  );
};
export default UserComments;
