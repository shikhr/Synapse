import { useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '../../context/AppContext';
import PostCard from '../Post/PostCard';
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
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['feed', 'hot'], fetchFeed, {
    getNextPageParam: (lastPage, pages) => {
      const { hasMorePages, currentPage } = lastPage.meta[0];
      return hasMorePages ? currentPage + 1 : undefined;
    },
  });

  console.log(data);
  return (
    <div className="text-white">
      <div className="flex flex-col">
        {data &&
          data.pages &&
          data.pages.map((page) => {
            return page.mydata.map((id: string) => (
              <PostCard key={id} id={id} />
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
    </div>
  );
};
export default Hot;
