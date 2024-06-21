import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAppContext();
  if (!isLoggedIn) {
    return <Navigate to="/register" />;
  }
  return children;
};
export default ProtectedRoute;
