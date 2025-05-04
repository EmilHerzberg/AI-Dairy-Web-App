/* contexts/AuthContext.js */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (username, password) => {
    if (username && password) setUser({ name: username });
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}