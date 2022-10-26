import { createContext, useContext, useReducer, ReactNode } from 'react';
import axios from 'axios';
import reducer from './reducer';
import { ActionKind } from './actions';

const user = localStorage.getItem('user');
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

interface IUser {
  _id: string;
  username: string;
  email: string;
  avatarId: string;
}

interface IAppContext {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  test: () => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const initialAppState: IAppContext = {
  user: user ? JSON.parse(user) : null,
  accessToken: accessToken,
  refreshToken: refreshToken,
  test: () => {},
};

const AppContext = createContext<IAppContext>({
  ...initialAppState,
});

const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialAppState);

  const saveUserToLocalStorage = ({
    user,
    accessToken,
    refreshToken,
  }: Record<string, any>) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const test = () => {
    dispatch({ type: ActionKind.TEST });
  };

  return (
    <AppContext.Provider value={{ ...state, test }}>
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
