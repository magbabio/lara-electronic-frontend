import { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest, verifyTokenRequest } from 'src/services/authAPI';
import Cookies from "js-cookie";

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
        setUser(res.data);
        setIsAuthenticated(true);
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
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
            setIsAuthenticated(false);
            setLoading(false);
            return
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
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