import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Erro ao carregar usuário');
      }
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      setError(err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return true;
      } else {
        throw new Error(data.message || 'Erro no login');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return true;
      } else {
        throw new Error(data.message || 'Erro no registro');
      }
    } catch (err) {
      console.error('Erro no registro:', err);
      setError(err.message);
      return false;
    }
  };

  const updateUser = (updatedUserData) => {
    if (user) {
      setUser({
        ...user,
        ...updatedUserData
      });
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      error,
      loading, 
      login, 
      register, 
      logout,
      updateUser,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 