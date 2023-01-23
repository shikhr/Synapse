import Hot from '../../components/Feed/Hot';
import AddPostForm from '../../components/Forms/AddPostForm';
import FadeInView from '../../components/MotionWrapper/FadeInView';
import DynamicNavMain from '../../components/UI/DynamicNavMain';

const Home = () => {
  return (
    <div>
      <DynamicNavMain title="Home" />
      <FadeInView>
        <AddPostForm />
        <Hot />
      </FadeInView>
    </div>
  );
};
export default Home;
