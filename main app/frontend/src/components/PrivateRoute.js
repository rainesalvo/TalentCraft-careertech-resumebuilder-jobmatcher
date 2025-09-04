// src/components/PrivateRoute.js
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default PrivateRoute;


