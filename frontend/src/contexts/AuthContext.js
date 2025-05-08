// frontend/contexts/AuthContext.js

/**
 * Purpose:
 *  - Holds authentication logic (login, register, logout).
 *  - Stores the user's token and userId, decoding token if available in localStorage.
 *  - Provides the user object and auth methods to child components.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // If you are actually using the 'jwt-decode' library, ensure it's installed.

const AuthContext = createContext();

/**
 * AuthProvider manages the user object and auth-related functions.
 * This includes:
 *  - Setting & retrieving the JWT from localStorage
 *  - Logging in, registering, and logging out
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /**
   * On first component mount, check localStorage for a previously stored token.
   * If found, decode it to retrieve userId; set 'user' state accordingly.
   */
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
   * Registration flow: 
   *  1. Send email, password, username to the backend.
   *  2. Expect a token in response.
   *  3. Decode it, set user state, store token in localStorage.
   */
  const register = async (email, password, username) => {
    try {
      const { data } = await axios.post('http://localhost:5000/auth/register', {
        email,
        password,
        username
      });

      const decoded = jwtDecode(data.token);
      setUser({
        userId: decoded.userId,
        token: data.token
      });
      localStorage.setItem('token', data.token);

      return { success: true };
    } catch (err) {
      console.error('Registration error', err);
      return { success: false, error: err.response?.data?.msg || 'Error' };
    }
  };

  /**
   * Login flow:
   *  1. Send credentials to the backend.
   *  2. On success, decode the token, set user state, store token in localStorage.
   */
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

      const decoded = jwtDecode(data.token);
      setUser({
        userId: decoded.userId,
        token: data.token
      });
      localStorage.setItem('token', data.token);

      return { success: true };
    } catch (err) {
      console.error('Login error', err);
      return { success: false, error: err.response?.data?.msg || 'Error' };
    }
  };

  /**
   * Logout:
   *  - Clear user from state
   *  - Remove token from localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Provide these values to all children within AuthContext
  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Convenient custom hook to access AuthContext from any component
 */
export const useAuth = () => useContext(AuthContext);
