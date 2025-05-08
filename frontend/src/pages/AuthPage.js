// frontend/pages/AuthPage.js

/**
 * Purpose:
 *  - Displays login or register form (toggles via isLoginMode).
 *  - Uses AuthContext methods (login, register) to authenticate users.
 *  - On success, navigates to /recorder.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthPage is responsible for presenting the user
 * with either a login form or a registration form.
 * It switches based on isLoginMode. 
 */
export default function AuthPage() {
  // Destructure the authentication methods from context
  const { login, register } = useAuth();
  // useNavigate() hook for programmatic navigation
  const navigate = useNavigate();

  // State to toggle between login and register modes
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form state for email, password, and username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Error message state
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Handles form submission.
   * Depending on mode, it calls login or register,
   * then navigates the user to /recorder if successful.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLoginMode) {
      // If the user is in "Login" mode
      const { success, error } = await login(email, password);
      if (success) {
        navigate('/recorder');
      } else {
        setErrorMsg(error);
      }
    } else {
      // If the user is in "Register" mode
      const { success, error } = await register(email, password, username);
      if (success) {
        navigate('/recorder');
      } else {
        setErrorMsg(error);
      }
    }
  };

  /**
   * Toggles between login and register mode.
   * Clears any displayed error messages when switching.
   */
  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setErrorMsg('');
  };

  return (
    <div className="container">
      <div 
        className="row d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh' }}
      >
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card p-4">

            {/* Display heading based on current mode */}
            <h2 className="mb-4 text-center diary-heading">
              {isLoginMode ? 'Login' : 'Register'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input 
                  id="email"
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Show "Username" only in Register mode */}
              {!isLoginMode && (
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username:</label>
                  <input 
                    id="username"
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input 
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Display error message, if any */}
              {errorMsg && (
                <div className="alert alert-danger p-2">
                  {errorMsg}
                </div>
              )}

              {/* Submit button will say "Login" or "Register" */}
              <button 
                type="submit" 
                className="btn btn-warm w-100 py-2"
              >
                {isLoginMode ? 'Login' : 'Register'}
              </button>
            </form>

            {/* Toggle link to switch between login/register */}
            <p className="mt-3 text-center">
              {isLoginMode 
                ? 'No account yet?' 
                : 'Already have an account?'}{' '}
              <button 
                onClick={toggleMode} 
                className="btn btn-link text-decoration-underline"
              >
                {isLoginMode ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
