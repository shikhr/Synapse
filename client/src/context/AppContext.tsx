import { createContext, useContext, useReducer, ReactNode } from 'react';
import reducer from './reducer';
import { ActionKind } from './actions';
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { QueryFunctionContext } from '@tanstack/react-query';
import defaultUserProfile from '../utils/defaultUserProfile';
import { IUserProfile } from '../types/Register.types';

const user = localStorage.getItem('user');
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

interface IUser {
  _id: string;
  username: string;
  email: string;
  avatarId?: string;
}

interface AppProviderProps {
  children: ReactNode;
}

interface ILocalStorageData {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

interface IAppContext {
  user: IUser | null;
  isLoggedIn: boolean;
  authFetch: any;
  registerUserSuccess: (data: ILocalStorageData) => void;
  updateUser: (data: IUser | null) => void;
  getProfile: ({ queryKey }: QueryFunctionContext) => Promise<IUserProfile>;
}

const initialAppState: IAppContext = {
  user: user ? JSON.parse(user) : null,
  isLoggedIn: user && accessToken && refreshToken ? true : false,
  registerUserSuccess: () => {},
  updateUser: () => {},
  authFetch: undefined,
  getProfile: () => Promise.resolve(defaultUserProfile),
};

const AppContext = createContext<IAppContext>({
  ...initialAppState,
});

const authFetch = axios.create({
  baseURL: '/api/v1',
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialAppState);

  authFetch.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (!config.headers) config.headers = {};
      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    }
  );

  authFetch.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        const config = error.config;
        const accessToken = await refreshAccessToken();
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers = JSON.parse(
          JSON.stringify(config.headers || {})
        ) as RawAxiosRequestHeaders;

        return axios.request(config);
      }
      return Promise.reject(error);
    }
  );

  const saveUserToLocalStorage = ({
    user,
    accessToken,
    refreshToken,
  }: ILocalStorageData) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const registerUserSuccess = (userData: ILocalStorageData) => {
    saveUserToLocalStorage(userData);
    accessToken = userData.accessToken;
    refreshToken = userData.refreshToken;
    dispatch({
      type: ActionKind.REGISTER_USER_SUCCESS,
      payload: userData,
    });
  };

  const updateUser = (user: IUser | null) => {
    saveUserToLocalStorage({
      user: user as IUser,
      accessToken: accessToken as string,
      refreshToken: refreshToken as string,
    });
    dispatch({
      type: ActionKind.REGISTER_USER_SUCCESS,
      payload: { user },
    });
  };

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/refresh', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const { user, accessToken: newAccessToken } = data;
      saveUserToLocalStorage({
        user,
        accessToken: newAccessToken,
        refreshToken: refreshToken as string,
      });
      accessToken = newAccessToken;
      dispatch({
        type: ActionKind.REGISTER_USER_SUCCESS,
        payload: { user },
      });
      return newAccessToken;
    } catch (error: any) {
      if (error.response.status === 401) {
        // logout();
        accessToken = null;
        refreshToken = null;
        removeUserFromLocalStorage();
        dispatch({ type: ActionKind.LOGOUT_USER });
      }
      return Promise.reject(error);
    }
  };

  const getProfile = async ({
    queryKey,
  }: QueryFunctionContext): Promise<IUserProfile> => {
    const { data } = await authFetch.get(`/users/profile/${queryKey[1]}`);
    return data;
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        authFetch,
        getProfile,
        registerUserSuccess,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
export { useAppContext };

export { type IAppContext };
