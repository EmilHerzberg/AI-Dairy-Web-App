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
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card p-4">
            <h2 className="mb-4 text-center diary-heading">
              {isLoginMode ? 'Login' : 'Register'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Email */}
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

              {/* Conditionally show username if in Register mode */}
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

              {/* Password */}
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

              {/* Error message, if any */}
              {errorMsg && (
                <div className="alert alert-danger p-2">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="btn btn-warm w-100 py-2">
                {isLoginMode ? 'Login' : 'Register'}
              </button>
            </form>

            {/* Toggle Link */}
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
