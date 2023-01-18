import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { IPostData } from '../types/Post.types';

const useFetchPost = (id: string) => {
  const { authFetch } = useAppContext();
  const navigate = useNavigate();

  const fetchPost = async ({
    queryKey,
  }: QueryFunctionContext): Promise<IPostData> => {
    const postId = queryKey[1];
    const { data } = await authFetch.get(`/posts/${postId}`);
    return data;
  };

  const queryData = useQuery(['post', id], fetchPost, {
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  return queryData;
};
export default useFetchPost;
