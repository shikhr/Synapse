import { AxiosResponse } from 'axios';
import { UseFormSetError } from 'react-hook-form';

interface IRegisterFields {
  username: string;
  email: string;
  password: string;
  identity: string;
}

type Tcallback<T> = (bodyData: T) => Promise<AxiosResponse<any, any>>;
type TsetError = UseFormSetError<IRegisterFields>;

export type { Tcallback, TsetError, IRegisterFields };
