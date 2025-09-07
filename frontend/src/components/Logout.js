import { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      await logout();
      navigate('/');
    };
  
    return <span onClick={handleLogout} className="cursor-pointer">
      Logout
    </span>;
}
