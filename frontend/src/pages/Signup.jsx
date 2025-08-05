import React, { useState } from 'react';
import api from '../api';
import './Login.css';

export default function Signup({ onSignup, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/accounts/signup/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      if (response.data.success) {
        setSuccess('Signup successful! You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        if (onSignup) onSignup();
      } else {
        setError(response.data.error || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <input
          type="text"
          placeholder="First Name (optional)"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name (optional)"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <button type="button" onClick={onBackToLogin} style={{marginTop: '10px'}}>Back to Login</button>
      </form>
    </div>
  );
}
