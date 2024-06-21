import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import CommentLoadingSkeleton from '../Skeletons/CommentLoadingSkeleton';
import CommentCard from './CommentCard';

interface CommentListProps {
  id: string;
}
interface commentsListPage {
  data: string[];
  meta: {
    currentPage: number;
    hasMorePages: boolean;
    totalPages: number;
  };
}

const CommentList = ({ id }: CommentListProps) => {
  const { authFetch } = useAppContext();

  const fetchCommentList = async ({
    queryKey,
    pageParam,
  }: QueryFunctionContext) => {
    const postId = queryKey[1];
    const { data } = await authFetch.get(`/comments/post/${postId}`, {
      params: { page: pageParam },
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
    queryKey: ['commentList', id],
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
      ListItemProps={{ postId: id }}
      hasNextPage={hasNextPage}
      LoadingErrorComponent={<FeedLoadingError refetch={refetch} />}
      isFetchingNextPage={isFetchingNextPage}
      isLoadingError={isLoadingError}
      NoContentElement={
        <div>There are no comments yet! Want to say something?</div>
      }
      ref={observerElem}
    />
  );
};
export default CommentList;
