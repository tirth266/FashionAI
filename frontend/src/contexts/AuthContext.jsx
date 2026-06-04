import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const googleLogin = async (credential) => {
    try {
      // Robust URL construction: ensures we hit /api/auth/google regardless of VITE_API_URL suffix
      const rootUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '').replace(/\/$/, '');
      const response = await axios.post(`${rootUrl}/api/auth/google`, { token: credential });
      const { user, token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
