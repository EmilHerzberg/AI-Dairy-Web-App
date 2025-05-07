/* frontend/pages/RegisterPage.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const { success, error } = await register(email, password, username);
    if (success) {
      // after successful registration, navigate to /recorder or wherever
      navigate('/recorder');
    } else {
      setErrorMsg(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <label>
          Email:
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="text"
          />
        </label>
        <label>
          Username:
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
          />
        </label>
        <label>
          Password:
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </label>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
