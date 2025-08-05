import React, { useState } from 'react';
import './Login.css';
import api from '../api';
import Signup from './Signup';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/token/', {
        username,
        password,
      });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  if (showSignup) {
    return <Signup onSignup={() => setShowSignup(false)} onBackToLogin={() => setShowSignup(false)} />;
  }

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={() => setShowSignup(true)} style={{marginTop: '10px'}}>Don't have an account? Sign Up</button>
      </form>
    </div>
  );
}
