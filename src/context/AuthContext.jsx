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
  const [loading, setLoading] = useState(true);

  const signin = async (user) => {
    try {
        const res = await loginRequest(user);
        setUser(res.data.Data.valUser);
        setIsAuthenticated(true);
        Cookies.set('token', res.data.Data.token, { expires: 7 });
        console.log('Sign in', isAuthenticated)
        return res;
    } catch (error) {
        throw error;
    }
}

const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get('token');
      console.log('holaaaaaa',token);
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(token);
        if (!res.data.Data) {
            setIsAuthenticated(false);
            setLoading(false);
            return
        }
        setIsAuthenticated(true);
        setUser(res.data.Data);
        setLoading(false);
        console.log('Check login', isAuthenticated)
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
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
        loading
      }}
  >
      {children}
  </AuthContext.Provider>
);
};