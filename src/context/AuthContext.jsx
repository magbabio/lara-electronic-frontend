import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { useState, useEffect, useContext, useMemo, useCallback, createContext } from 'react';

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
          setErrors([]);
        }, 5000);
        return () => {
          clearTimeout(timer);
        };
      }
      // Add a return statement here if needed
      return () => {};
    }, [errors]);

      useEffect(() => {
        const checkLogin = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            setUser(null);
          } else {
            try {
              const res = await verifyTokenRequest(token);
              if (!res.data) {
                setIsAuthenticated(false);
                setLoading(false);
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

      const signin = useCallback(async (userData) => {
        const res = await loginRequest(userData);
        setUser(res.data);
        setIsAuthenticated(true);
        localStorage.setItem('token', res.data.token);
        return res;
      }, []);
    
      const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }, []);

  const value = useMemo(() => ({
    user,
    signin,
    logout,
    isAuthenticated,
    errors,
    loading,
  }), [user, signin, logout, isAuthenticated, errors, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.bool,
};