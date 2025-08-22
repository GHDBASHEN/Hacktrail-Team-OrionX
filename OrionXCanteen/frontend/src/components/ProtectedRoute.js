import { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, name }) => {
  const { user } = useContext(AuthContext);
  const role = sessionStorage.getItem("role");
  if (name === role) {
    return children;
  }else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
