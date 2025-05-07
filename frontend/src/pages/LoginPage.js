/* frontend/pages/LoginPage.js */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/LoginInputField';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.getElementById('email-input')?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { success, error } = await login(email, password);
    if (success) {
      // redirect to the recorder after successful login
      navigate('/recorder');
    } else {
      setErrorMsg(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Login Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Email"
          type="text"
          value={email}
          id="email-input"
          onChange={e => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Sign In
        </button>
      </form>
    </div>
  );
}
