import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync state with localStorage if it changes
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, [token, role]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/authenticate', { email, password });

      if (response.data.success) {
        const data = response.data.data;
        setToken(data.token);
        // The API returns 'SuperAdmin' or other roles.
        // We'll normalize it to lowercase 'supervisor' or 'admin' for easier checks in the app.
        const normalizedRole = data.role === 'SuperAdmin' ? 'supervisor' : 'admin';
        setRole(normalizedRole);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
