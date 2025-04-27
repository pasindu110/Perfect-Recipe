import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  // Add automatic token refresh
  useEffect(() => {
    if (isAuthenticated) {
      const REFRESH_INTERVAL = 14 * 60 * 1000; // Refresh every 14 minutes
      const refreshInterval = setInterval(async () => {
        await refreshToken();
      }, REFRESH_INTERVAL);

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        await logout();
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        await logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      // Fetch full user details after login
      const userResponse = await fetch(`${API_URL}/api/users/${data.user.id}`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        data.user = { ...data.user, ...userData };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsAuthenticated(true);
      setUser(data.user);
      navigate('/');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return false;

      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        await logout();
        return false;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      refreshToken,
      token: localStorage.getItem('token') 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};