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
