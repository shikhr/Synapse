import { IUserProfile } from '../types/Register.types';

const defaultUserProfile: IUserProfile = {
  _id: '',
  username: '',
  displayName: '',
  following: '',
  followers: '',
  avatarId: '',
  birthDate: undefined,
  location: '',
  website: '',
  bio: '',
  isFollowing: '',
};

export default defaultUserProfile;
