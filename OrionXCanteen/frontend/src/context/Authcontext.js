import { createContext, useState } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('credential');
        try {
          return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
          console.error('Error parsing user from sessionStorage:', e);
          return null;
        }
      });

    const login = (credential, id, role, token, refreshToken) => {
        setUser(credential);
        sessionStorage.setItem('credential', JSON.stringify(credential));
        sessionStorage.setItem('id', id);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('token', token); // Save token in sessionStorage
        sessionStorage.setItem('refreshToken', refreshToken); // Save refresh token in sessionStorage
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('credential');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
