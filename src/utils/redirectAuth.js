import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export function redirectIfAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = Cookies.get('currentUser');
    if (currentUser) navigate('/dashboard', { replace: true });
  }, [navigate]);
}
