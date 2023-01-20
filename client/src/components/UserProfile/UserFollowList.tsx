interface UserFollowList {
  type: 'followers' | 'following';
}

const UserFollowList = ({ type }: UserFollowList) => {
  return <div>UserFollowList {type}</div>;
};
export default UserFollowList;
