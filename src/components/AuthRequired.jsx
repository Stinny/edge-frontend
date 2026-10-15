import { useLocation, Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRequired = () => {
  const location = useLocation();
  const currentUser = Cookies.get('currentUser')
    ? JSON.parse(Cookies.get('currentUser'))
    : null;

  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthRequired;
