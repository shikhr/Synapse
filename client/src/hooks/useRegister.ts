import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useAppContext } from '../context/AppContext';
import { Tcallback, TsetError } from '../types/Register.types';

const useRegister = <T>(callback: Tcallback<T>, setError: TsetError) => {
  const { registerUserSuccess } = useAppContext();

  return useMutation(callback, {
    onError: (error: AxiosError, variables, context) => {
      const data: any = error.response!.data;
      data.fields.forEach((field: any) => {
        setError(field, { type: 'server', message: data.msg });
      });
    },
    onSuccess: (data, variables, context) => {
      registerUserSuccess(data.data);
    },
  });
};

export default useRegister;
