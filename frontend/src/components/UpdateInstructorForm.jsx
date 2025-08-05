import React, { useState } from 'react';
import api from '../api';
import './UpdateInstructorForm.css';

export default function UpdateInstructorForm({ instructor, onClose, onSuccess }) {
  const [username, setUsername] = useState(instructor.username || '');
  const [firstName, setFirstName] = useState(instructor.first_name || instructor.firstName || '');
  const [lastName, setLastName] = useState(instructor.last_name || instructor.lastName || '');
  const [email, setEmail] = useState(instructor.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/instructors/${instructor.id}/`, {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        ...(password ? { password } : {})
      });
      setSuccess('Instructor updated successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Failed to update instructor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-instructor-modal-overlay">
      <div className="update-instructor-modal">
        <form className="update-instructor-form" onSubmit={handleSubmit}>
          <div className="update-instructor-form-title">Edit Instructor</div>
          {error && <div className="update-instructor-form-error">{error}</div>}
          {success && <div className="update-instructor-form-success">{success}</div>}
          <div className="update-instructor-form-group">
            <label className="update-instructor-form-label" htmlFor="edit-instructor-username">Username</label>
            <input
              id="edit-instructor-username"
              className="update-instructor-form-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="update-instructor-form-group">
            <label className="update-instructor-form-label" htmlFor="edit-instructor-firstname">First Name</label>
            <input
              id="edit-instructor-firstname"
              className="update-instructor-form-input"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="update-instructor-form-group">
            <label className="update-instructor-form-label" htmlFor="edit-instructor-lastname">Last Name</label>
            <input
              id="edit-instructor-lastname"
              className="update-instructor-form-input"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="update-instructor-form-group">
            <label className="update-instructor-form-label" htmlFor="edit-instructor-email">Email</label>
            <input
              id="edit-instructor-email"
              className="update-instructor-form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="update-instructor-form-group">
            <label className="update-instructor-form-label" htmlFor="edit-instructor-password">Password</label>
            <input
              id="edit-instructor-password"
              className="update-instructor-form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Leave blank to keep unchanged"
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="update-instructor-form-button" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="update-instructor-form-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
