import React, { useState } from 'react';
import api from '../api';
import './AddInstructorForm.css';

export default function AddInstructorForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/instructors/', { username, first_name: firstName, last_name: lastName, email, password });
      setUsername('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Failed to add instructor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-instructor-form" onSubmit={handleSubmit}>
      <div className="add-instructor-form-title">Add New Instructor</div>
      <div className="add-instructor-form-group">
        <label className="add-instructor-form-label" htmlFor="instructor-username">Username</label>
        <input
          id="instructor-username"
          className="add-instructor-form-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="add-instructor-form-group">
        <label className="add-instructor-form-label" htmlFor="instructor-firstname">First Name</label>
        <input
          id="instructor-firstname"
          className="add-instructor-form-input"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="add-instructor-form-group">
        <label className="add-instructor-form-label" htmlFor="instructor-lastname">Last Name</label>
        <input
          id="instructor-lastname"
          className="add-instructor-form-input"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="add-instructor-form-group">
        <label className="add-instructor-form-label" htmlFor="instructor-email">Email</label>
        <input
          id="instructor-email"
          className="add-instructor-form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="add-instructor-form-group">
        <label className="add-instructor-form-label" htmlFor="instructor-password">Password</label>
        <input
          id="instructor-password"
          className="add-instructor-form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="add-instructor-form-error">{error}</div>}
      <button className="add-instructor-form-button" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Instructor'}</button>
    </form>
  );
}
