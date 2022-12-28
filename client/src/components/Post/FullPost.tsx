import { useParams } from 'react-router-dom';
import DynamicNavTitle from '../UI/DynamicNavTitle';
import PostCard from './PostCard';

const FullPost = () => {
  const { postId } = useParams();
  if (!postId) {
    return <div>error</div>;
  }
  return (
    <div>
      <DynamicNavTitle title="Post" />
      <PostCard id={postId} />
    </div>
  );
};
export default FullPost;
