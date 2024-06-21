import { AxiosResponse } from 'axios';
import { UseFormSetError } from 'react-hook-form';

interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  identity: string;
}

interface IEditFormFields {
  avatar: FileList | undefined;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  birthDate: string | Date | null;
}

interface IUserProfile {
  _id: string;
  username: string;
  displayName: string;
  avatarId: string;
  bio: string;
  birthDate: string | undefined;
  location: string;
  website: string;
  following: string;
  followers: string;
  isFollowing: string;
}

interface IUserBasic {
  _id: string;
  username: string;
  displayName: string;
  avatarId: string;
  followExists: boolean;
}

type Tcallback<T> = (bodyData: T) => Promise<AxiosResponse<any, any>>;
type TsetError = UseFormSetError<IRegisterFields>;

export type {
  Tcallback,
  TsetError,
  IRegisterFields,
  IEditFormFields,
  IUserProfile,
  IUserBasic,
};
