/* pages/LoginPage.js */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/LoginInputField';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Example useEffect: focus the first input on mount
  useEffect(() => {
    document.getElementById('username-input')?.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    login(username, password);
    navigate('/', { replace: true });
  };

  return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Login Page</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Username"
            type="text"
            value={username}
            id="username-input"
            onChange={e => setUsername(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Sign In
          </button>
        </form>
      </div>
  );
}
