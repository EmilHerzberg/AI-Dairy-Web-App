/* frontend/contexts/AuthContext.js */
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

/**
 * The AuthProvider will store the user object (including userId, token)
 * and provide login/logout/register functions to child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On first mount, check localStorage for an existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          token: token
        });
      } catch (err) {
        console.error('Error decoding token', err);
      }
    }
  }, []);

  /**
   * Register flow
   */
  const register = async (email, password, username) => {
    try {
      const { data } = await axios.post('http://localhost:5000/auth/register', {
        email,
        password,
        username
      });

      // data should contain { token } from your backend
      const decoded = jwtDecode(data.token);

      // Save token and user in state
      setUser({
        userId: decoded.userId,
        token: data.token
      });

      // Also store in localStorage
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (err) {
      console.error('Registration error', err);
      return { success: false, error: err.response?.data?.msg || 'Error' };
    }
  };

  /**
   * Login flow
   */
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

      // data should contain { token } from your backend
      const decoded = jwtDecode(data.token);

      // Save token and user in state
      setUser({
        userId: decoded.userId,
        token: data.token
      });
      // Also store in localStorage
      localStorage.setItem('token', data.token);

      return { success: true };
    } catch (err) {
      console.error('Login error', err);
      return { success: false, error: err.response?.data?.msg || 'Error' };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Simple hook to use auth
export const useAuth = () => useContext(AuthContext);
