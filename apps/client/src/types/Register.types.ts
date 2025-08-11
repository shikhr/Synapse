import { AxiosResponse } from 'axios';
import { UseFormSetError } from 'react-hook-form';

interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  identity: string;
}

interface IEditFormFields {
  bio?: string | undefined;
  avatar?: any | undefined;
  location?: string | undefined;
  birthDate?: string | null | undefined;
  website?: string | undefined;
  displayName: string;
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
  IEditFormFields,
  IRegisterFields,
  IUserProfile,
  IUserBasic,
};
