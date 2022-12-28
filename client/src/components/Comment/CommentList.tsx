import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['commentList', id], fetchCommentList, {
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.meta) return undefined;
      const { hasMorePages, currentPage } = lastPage.meta;
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });
  console.log(commentList);
  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div className="w-full">
      {commentList &&
        commentList.pages &&
        commentList.pages.map((page) => {
          return page.mydata.map((id: string) => (
            <CommentCard key={id} id={id} />
          ));
        })}
    </div>
  );
};
export default CommentList;
