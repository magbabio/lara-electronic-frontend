import Cookies from "js-cookie";
import { useState, useEffect, useContext, createContext } from 'react';

import { loginRequest, verifyTokenRequest } from 'src/services/authAPI';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            localStorage.setItem('token', res.data.token)
            return res;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      };

      useEffect(() => {
        const checkLogin = async () => {
          const token = localStorage.getItem('token')
          if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return setUser(null);
          } else {
            try {
              const res = await verifyTokenRequest(token);
              if (!res.data) {
                  setIsAuthenticated(false);
                  setLoading(false);
                  return
              } else {
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
              }
            } catch (error) {
              setIsAuthenticated(false);
              setUser(null);
              setLoading(false);
            }
          }
  
        };
        checkLogin();
      }, []);

return (
  <AuthContext.Provider
      value={{
        user,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading
      }}
  >
      {children}
  </AuthContext.Provider>
);
};