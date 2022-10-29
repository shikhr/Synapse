import { createContext, useContext, useReducer, ReactNode } from 'react';
import reducer from './reducer';
import { ActionKind } from './actions';
import { useNavigate } from 'react-router-dom';

const user = localStorage.getItem('user');
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

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
  accessToken: string | null;
  refreshToken: string | null;
  registerUserSuccess: (data: ILocalStorageData) => void;
}

const initialAppState: IAppContext = {
  user: user ? JSON.parse(user) : null,
  accessToken: accessToken,
  refreshToken: refreshToken,
  registerUserSuccess: () => {},
};

const AppContext = createContext<IAppContext>({
  ...initialAppState,
});

const AppProvider = ({ children }: AppProviderProps) => {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialAppState);

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
    dispatch({ type: ActionKind.REGISTER_USER_SUCCESS, payload: userData });
  };

  return (
    <AppContext.Provider value={{ ...state, registerUserSuccess }}>
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
