import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import FeedLoadingError from '../Errrors/FeedLoadingError';
import CommentLoadingSkeleton from '../Skeletons/CommentLoadingSkeleton';
import Button from '../UI/Button';
import CommentCard from './CommentCard';

interface CommentListProps {
  id: string;
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
  } = useInfiniteQuery(['commentList', id], fetchCommentList, {
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
    <div className="w-full">
      {isLoading && (
        <>
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
        </>
      )}
      <div>
        {commentList &&
          commentList.pages &&
          commentList.pages.map((page) => {
            return page.mydata.map((id: string) => (
              <CommentCard key={id} id={id} />
            ));
          })}
      </div>
      <Button
        variant="standard"
        disabled={!hasNextPage}
        onClick={() => fetchNextPage()}
      >
        next
      </Button>
      {isFetchingNextPage && (
        <>
          <CommentLoadingSkeleton />
        </>
      )}
      {isError && !isFetchingNextPage && (
        <FeedLoadingError refetch={fetchNextPage} />
      )}
    </div>
  );
};
export default CommentList;
