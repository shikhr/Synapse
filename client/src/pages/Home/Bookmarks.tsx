import BookmarkList from '../../components/Bookmark/BookmarkList';
import DynamicNavTitle from '../../components/UI/DynamicNavTitle';

const Bookmarks = () => {
  return (
    <div>
      <DynamicNavTitle title="Bookmarks" />
      <BookmarkList />
    </div>
  );
};
export default Bookmarks;
