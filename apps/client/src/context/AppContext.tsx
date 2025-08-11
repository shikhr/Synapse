import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
} from 'react';
import reducer from './reducer';
import { ActionKind } from './actions';
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  RawAxiosRequestHeaders,
} from 'axios';
import axiosInstance from '../utils/axiosBase';

const user = localStorage.getItem('user');
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

interface IUser {
  _id: string;
  username: string;
  email: string;
  avatarId?: string;
  displayName: string;
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
  authFetch?: any;
  registerUserSuccess: (data: ILocalStorageData) => void;
  updateUser: (data: IUser | null) => void;
  logoutUser: () => void;
}

const initialAppState: IAppContext = {
  user: user ? JSON.parse(user) : null,
  isLoggedIn: user && accessToken && refreshToken ? true : false,
  registerUserSuccess: () => {},
  updateUser: () => {},
  logoutUser: () => {},
};

const AppContext = createContext<IAppContext>({
  ...initialAppState,
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialAppState);

  const authFetchRef = useRef(
    axios.create({
      baseURL:
        (import.meta.env.VITE_APP_API_URL || 'http://localhost:5000') +
        '/api/v1',
    })
  );

  authFetchRef.current.interceptors.request.use((config) => {
    if (!config.headers) config.headers = {} as AxiosRequestHeaders;
    config.headers.authorization = `Bearer ${accessToken}`;
    return config;
  });

  authFetchRef.current.interceptors.response.use(
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

        return axiosInstance.request(config);
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

  const logoutUser = async () => {
    accessToken = null;
    refreshToken = null;
    removeUserFromLocalStorage();
    dispatch({ type: ActionKind.LOGOUT_USER });
  };

  const refreshAccessToken = async () => {
    try {
      const { data } = await axiosInstance.get('/api/v1/auth/refresh', {
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
        logoutUser();
      }
      return Promise.reject(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        authFetch: authFetchRef.current,
        registerUserSuccess,
        updateUser,
        logoutUser,
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
