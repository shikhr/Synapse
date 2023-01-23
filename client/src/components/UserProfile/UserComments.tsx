import { useParams } from 'react-router-dom';

const UserComments = () => {
  const params = useParams();
  console.log(params);
  return <div>UserComments</div>;
};
export default UserComments;
