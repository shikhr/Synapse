import { Outlet } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Hot from '../../components/Feed/Hot';
import AddPostForm from '../../components/Forms/AddPostForm';
import DynamicNavMain from '../../components/UI/DynamicNavMain';

const Home = () => {
  return (
    <div>
      <DynamicNavMain title="Home" />
      <AddPostForm />
      <Hot />
    </div>
  );
};
export default Home;
