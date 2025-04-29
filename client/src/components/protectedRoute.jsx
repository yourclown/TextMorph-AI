import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if auth_token exists in cookies
    const token = document.cookie.split('').find(cookie => cookie.trim().startsWith('auth_token='));
    // console.log(token);

    if (!token) {
      // If no token, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
