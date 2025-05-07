import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);

  // Shared form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLoginMode) {
      // Login flow
      const { success, error } = await login(email, password);
      if (success) {
        navigate('/recorder');
      } else {
        setErrorMsg(error);
      }
    } else {
      // Register flow
      const { success, error } = await register(email, password, username);
      if (success) {
        navigate('/recorder');
      } else {
        setErrorMsg(error);
      }
    }
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">
        {isLoginMode ? 'Login' : 'Register'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          />
        </label>

        {/* Conditionally show username if in Register mode */}
        {!isLoginMode && (
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded"
            />
          </label>
        )}

        {/* Password */}
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
          />
        </label>

        {/* Error message, if any */}
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        {/* Submit Button */}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {isLoginMode ? 'Login' : 'Register'}
        </button>
      </form>

      {/* Toggle Link */}
      <p className="mt-4">
        {isLoginMode 
          ? 'No account yet?' 
          : 'Already have an account?'}
        {' '}
        <button onClick={toggleMode} className="text-blue-500 underline">
          {isLoginMode ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}
