import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import useInfiniteQueryScroll from '../../hooks/useInfiniteQueryScroll';
import FeedLoadingError from '../Errrors/FeedLoadingError';
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

  console.log(commentList);

  if (isLoadingError) {
    return <FeedLoadingError refetch={refetch} />;
  }

  return (
    <div className="w-full pb-16">
      {isLoading && (
        <>
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
        </>
      )}
      <div className="flex flex-col">
        {commentList &&
          commentList.pages &&
          commentList.pages.map((page) => {
            return page.data.map((id: string) => (
              <CommentCard key={id} id={id} />
            ));
          })}
      </div>
      {isError && !isFetchingNextPage && (
        <FeedLoadingError refetch={fetchNextPage} />
      )}
      <div ref={observerElem}>
        {isFetchingNextPage && hasNextPage && <CommentLoadingSkeleton />}
      </div>
    </div>
  );
};
export default CommentList;
